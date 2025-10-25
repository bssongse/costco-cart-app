import { useState, useEffect, useMemo } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import './App.css';

const CATEGORIES = ['식품', '생활용품', '가전', '의류', '기타'];

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartId, setCartId] = useState('');
  const [cartTitle, setCartTitle] = useState('코스트코 장바구니');
  const [editingTitle, setEditingTitle] = useState(false);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('식품');
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [shareLink, setShareLink] = useState('');

  // 익명 인증
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
          setAuthLoading(false);
        } catch (error) {
          console.error('익명 인증 오류:', error);
          setAuthLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // URL에서 cartId 가져오기 또는 생성
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('cart');

    if (idFromUrl) {
      setCartId(idFromUrl);
    } else {
      // 새 장바구니 ID 생성
      const newCartId = generateCartId();
      setCartId(newCartId);
      const newUrl = `${window.location.origin}${window.location.pathname}?cart=${newCartId}`;
      window.history.pushState({}, '', newUrl);
      setShareLink(newUrl);
    }
  }, []);

  // Firestore 실시간 동기화
  useEffect(() => {
    if (!cartId) return;

    const itemsRef = collection(db, 'carts', cartId, 'items');

    // 실시간 리스너 설정
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const itemsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    }, (error) => {
      console.error('Firestore 연동 오류:', error);
      alert('Firebase 설정을 완료해주세요. .env 파일을 확인하세요.');
    });

    // 장바구니 생성 또는 불러오기
    const cartRef = doc(db, 'carts', cartId);
    getDoc(cartRef).then((docSnap) => {
      if (!docSnap.exists()) {
        setDoc(cartRef, {
          title: cartTitle,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      } else {
        const data = docSnap.data();
        if (data.title) {
          setCartTitle(data.title);
        }
      }
    });

    setShareLink(`${window.location.origin}${window.location.pathname}?cart=${cartId}`);

    return () => unsubscribe();
  }, [cartId]);

  // 총액 계산
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  }, [items]);

  // 랜덤 ID 생성
  const generateCartId = () => {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  };

  // 장바구니 제목 업데이트
  const updateCartTitle = async (newTitle) => {
    if (!newTitle.trim()) return;

    try {
      const cartRef = doc(db, 'carts', cartId);
      await updateDoc(cartRef, {
        title: newTitle,
        lastUpdated: new Date().toISOString()
      });
      setCartTitle(newTitle);
      setEditingTitle(false);
    } catch (error) {
      console.error('제목 수정 오류:', error);
    }
  };

  // 아이템 추가
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    // 사용자 인증 확인
    if (!user) {
      console.error('사용자가 인증되지 않았습니다.');
      alert('사용자 인증 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // cartId 확인
    if (!cartId) {
      console.error('장바구니 ID가 없습니다.');
      alert('장바구니를 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      console.log('아이템 추가 시작:', { cartId, user: user.uid });
      const itemsRef = collection(db, 'carts', cartId, 'items');
      await addDoc(itemsRef, {
        name: newItemName,
        quantity: parseInt(newItemQuantity),
        price: parseFloat(newItemPrice) || 0,
        category: newItemCategory,
        note: '',
        checked: false,
        createdAt: new Date().toISOString()
      });

      console.log('아이템 추가 성공');
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemPrice('');
      setNewItemCategory('식품');
    } catch (error) {
      console.error('아이템 추가 오류 상세:', error);
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);

      // 더 구체적인 에러 메시지
      let errorMessage = '아이템 추가에 실패했습니다.\n';
      if (error.code === 'permission-denied') {
        errorMessage += '권한이 없습니다. Firebase 설정을 확인해주세요.';
      } else if (error.code === 'unavailable') {
        errorMessage += '네트워크 연결을 확인해주세요.';
      } else {
        errorMessage += `오류: ${error.message}`;
      }
      alert(errorMessage);
    }
  };

  // 아이템 수정
  const updateItem = async (itemId, updates) => {
    try {
      const itemRef = doc(db, 'carts', cartId, 'items', itemId);
      await updateDoc(itemRef, updates);
    } catch (error) {
      console.error('아이템 수정 오류:', error);
      alert('아이템 수정에 실패했습니다.');
    }
  };

  // 아이템 삭제
  const deleteItem = async (itemId) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return;

    try {
      const itemRef = doc(db, 'carts', cartId, 'items', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('아이템 삭제 오류:', error);
      alert('아이템 삭제에 실패했습니다.');
    }
  };

  // 체크박스 토글
  const toggleCheck = (itemId, currentChecked) => {
    updateItem(itemId, { checked: !currentChecked });
  };

  // 수량 변경
  const changeQuantity = (itemId, delta) => {
    const item = items.find(i => i.id === itemId);
    const newQuantity = Math.max(1, item.quantity + delta);
    updateItem(itemId, { quantity: newQuantity });
  };

  // 링크 복사
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('링크가 복사되었습니다!');
  };

  // 카테고리별 그룹화
  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const category = item.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [items]);

  // 로딩 중 표시
  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        {editingTitle ? (
          <input
            type="text"
            value={cartTitle}
            onChange={(e) => setCartTitle(e.target.value)}
            onBlur={() => updateCartTitle(cartTitle)}
            onKeyPress={(e) => e.key === 'Enter' && updateCartTitle(cartTitle)}
            autoFocus
            className="title-input"
          />
        ) : (
          <h1 onClick={() => setEditingTitle(true)} className="cart-title">
            🛒 {cartTitle}
          </h1>
        )}
        <div className="share-section">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="share-link"
          />
          <button onClick={copyShareLink} className="copy-btn">
            링크 복사
          </button>
        </div>
      </header>

      <main className="app-main">
        <form onSubmit={addItem} className="add-item-form">
          <input
            type="text"
            placeholder="상품명"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="item-input"
            required
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="category-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            className="quantity-input"
            placeholder="수량"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="price-input"
            placeholder="가격"
          />
          <button type="submit" className="add-btn">
            추가
          </button>
        </form>

        {items.length > 0 && (
          <div className="total-section">
            <h2>총액: ₩{totalAmount.toLocaleString()}</h2>
          </div>
        )}

        <div className="items-container">
          {items.length === 0 ? (
            <p className="empty-message">장바구니가 비어있습니다</p>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="category-group">
                <h3 className="category-title">{category} ({categoryItems.length})</h3>
                <div className="items-list">
                  {categoryItems.map((item) => (
                    <div key={item.id} className={`item ${item.checked ? 'checked' : ''}`}>
                      <div className="item-main">
                        <input
                          type="checkbox"
                          checked={item.checked || false}
                          onChange={() => toggleCheck(item.id, item.checked)}
                          className="item-checkbox"
                        />

                        {editingItem === item.id ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            onBlur={() => setEditingItem(null)}
                            autoFocus
                            className="item-edit-input"
                          />
                        ) : (
                          <span
                            className="item-name"
                            onDoubleClick={() => setEditingItem(item.id)}
                          >
                            {item.name}
                          </span>
                        )}

                        <div className="item-info">
                          <span className="item-price">
                            ₩{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>
                        </div>

                        <div className="item-controls">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="item-quantity">{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            className="expand-btn"
                          >
                            {expandedItem === item.id ? '▲' : '▼'}
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="delete-btn"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {expandedItem === item.id && (
                        <div className="item-details">
                          <div className="detail-row">
                            <label>개당 가격:</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price || ''}
                              onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                              className="detail-input"
                              placeholder="가격 입력"
                            />
                          </div>
                          <div className="detail-row">
                            <label>카테고리:</label>
                            <select
                              value={item.category || '기타'}
                              onChange={(e) => updateItem(item.id, { category: e.target.value })}
                              className="detail-select"
                            >
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="detail-row">
                            <label>메모:</label>
                            <textarea
                              value={item.note || ''}
                              onChange={(e) => updateItem(item.id, { note: e.target.value })}
                              className="detail-textarea"
                              placeholder="메모 입력..."
                              rows="2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
