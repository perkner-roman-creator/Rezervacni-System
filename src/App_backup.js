import React, { useState } from 'react';
import './App.css';

function App() {
  // Vícejazyčná podpora
  const [lang, setLang] = useState('cs');
  const texts = {
    cs: {
      title: 'Rezervační systém',
      register: 'Registrace',
      login: 'Přihlášení',
      username: 'Uživatelské jméno',
      password: 'Heslo',
      registerBtn: 'Registrovat',
      loginBtn: 'Přihlásit',
      logout: 'Odhlásit',
      reservation: 'Rezervovat',
      name: 'Jméno',
      email: 'Email',
      date: 'Termín',
      reservations: 'Seznam rezervací',
      noReservations: 'Žádné rezervace',
      edit: 'Upravit',
      delete: 'Odstranit',
      review: 'Recenze',
      saveReview: 'Uložit recenzi',
      cancel: 'Zrušit',
      calendar: 'Kalendář dostupnosti (aktuální měsíc)',
      occupied: 'Obsazeno',
      free: 'Volné',
    },
    en: {
      title: 'Booking System',
      register: 'Register',
      login: 'Login',
      username: 'Username',
      password: 'Password',
      registerBtn: 'Register',
      loginBtn: 'Login',
      logout: 'Logout',
      reservation: 'Book',
      name: 'Name',
      email: 'Email',
      date: 'Date',
      reservations: 'Reservations',
      noReservations: 'No reservations',
      edit: 'Edit',
      delete: 'Delete',
      review: 'Review',
      saveReview: 'Save review',
      cancel: 'Cancel',
      calendar: 'Availability Calendar (current month)',
      occupied: 'Occupied',
      free: 'Free',
    }
  };

  // Stavy
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggedUser, setLoggedUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([{ username: 'admin', password: 'admin' }]);
  const [rezervace, setRezervace] = useState([]);
  const [jmeno, setJmeno] = useState('');
  const [email, setEmail] = useState('');
  const [termin, setTermin] = useState('');
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editJmeno, setEditJmeno] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTermin, setEditTermin] = useState('');
  const [reviewIndex, setReviewIndex] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);

  // Funkce
  const handleRegister = e => {
    e.preventDefault();
    if (!regUsername || !regPassword) {
      setAuthError('Vyplňte všechny údaje');
      return;
    }
    if (users.find(u => u.username === regUsername)) {
      setAuthError('Uživatel již existuje');
      return;
    }
    setUsers([...users, { username: regUsername, password: regPassword }]);
    setAuthError('');
    setRegUsername('');
    setRegPassword('');
    alert('Registrace úspěšná!');
  };

  const handleLogin = e => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (!user) {
      setAuthError('Špatné jméno nebo heslo');
      return;
    }
    setLoggedUser(user.username);
    setIsAdmin(user.username === 'admin');
    setAuthError('');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    setLoggedUser('');
    setIsAdmin(false);
  };

  const odeslatRezervaci = e => {
    e.preventDefault();
    if (!jmeno || !email || !termin) {
      setError('Vyplňte všechny údaje');
      return;
    }
    setPendingReservation({ jmeno, email, termin, user: loggedUser });
    setShowPayment(true);
  };

  const handlePayment = () => {
    setRezervace([...rezervace, { ...pendingReservation }]);
    setShowPayment(false);
    setPendingReservation(null);
    setJmeno('');
    setEmail('');
    setTermin('');
    alert('Rezervace byla úspěšně vytvořena!');
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    setPendingReservation(null);
  };

  const odebratRezervaci = index => {
    setRezervace(rezervace.filter((_, i) => i !== index));
  };

  const startEdit = index => {
    setEditIndex(index);
    setEditJmeno(rezervace[index].jmeno);
    setEditEmail(rezervace[index].email);
    setEditTermin(rezervace[index].termin);
  };

  const saveEdit = e => {
    e.preventDefault();
    const updated = [...rezervace];
    updated[editIndex] = {
      ...updated[editIndex],
      jmeno: editJmeno,
      email: editEmail,
      termin: editTermin
    };
    setRezervace(updated);
    setEditIndex(null);
    setEditJmeno('');
    setEditEmail('');
    setEditTermin('');
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditJmeno('');
    setEditEmail('');
    setEditTermin('');
  };

  const startReview = index => {
    setReviewIndex(index);
    setReviewText(rezervace[index].review || '');
    setReviewStars(rezervace[index].stars || 5);
  };

  const saveReview = e => {
    e.preventDefault();
    const updated = [...rezervace];
    updated[reviewIndex] = {
      ...updated[reviewIndex],
      review: reviewText,
      stars: reviewStars
    };
    setRezervace(updated);
    setReviewIndex(null);
    setReviewText('');
    setReviewStars(5);
  };

  const cancelReview = () => {
    setReviewIndex(null);
    setReviewText('');
    setReviewStars(5);
  };

  // Kalendář aktuálního měsíce
  const getMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dates = [];
    for (let d = 1; d <= 31; d++) {
      const date = new Date(year, month, d);
      if (date.getMonth() !== month) break;
      dates.push(date.toISOString().slice(0, 10));
    }
    return dates;
  };

  // Filtrování rezervací (pouze pro uživatele)
  const filterReservations = arr => arr;

  return (
    <div className="App">
      <h1>{texts[lang].title}</h1>
      {!loggedUser ? (
        <div style={{ marginBottom: '30px' }}>
          <h2>{texts[lang].register}</h2>
          <form onSubmit={handleRegister} style={{ marginBottom: '10px' }}>
            {authError && <div style={{ color: 'red', marginBottom: '10px' }}>{authError}</div>}
            <input type="text" placeholder={texts[lang].username} value={regUsername} onChange={e => setRegUsername(e.target.value)} style={{ marginRight: '10px' }} />
            <input type="password" placeholder={texts[lang].password} value={regPassword} onChange={e => setRegPassword(e.target.value)} style={{ marginRight: '10px' }} />
            <button type="submit">{texts[lang].registerBtn}</button>
          </form>
          <h2>{texts[lang].login}</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder={texts[lang].username} value={loginUsername} onChange={e => setLoginUsername(e.target.value)} style={{ marginRight: '10px' }} />
            <input type="password" placeholder={texts[lang].password} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ marginRight: '10px' }} />
            <button type="submit">{texts[lang].loginBtn}</button>
          </form>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <div>Jste přihlášen jako <strong>{loggedUser}</strong> <button onClick={handleLogout}>{texts[lang].logout}</button></div>
        </div>
      )}
      {loggedUser && (
        isAdmin ? (
          <div className="admin-panel">
            <h2>Admin rozhraní</h2>
            <h3>Uživatelé</h3>
            <ul>
              {users.map(u => (
                <li key={u.username}><strong>{u.username}</strong></li>
              ))}
            </ul>
            <h3>Všechny rezervace</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {rezervace.length === 0 && <li>{texts[lang].noReservations}</li>}
              {rezervace.map((r, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <strong>{r.jmeno}</strong> ({r.email}) - {r.termin} <em>[{r.user}]</em>
                  <button style={{ marginLeft: '10px' }} onClick={() => odebratRezervaci(index)}>{texts[lang].delete}</button>
                  {r.review && (
                    <div style={{ marginTop: '5px', background: '#f8f8f8', padding: '6px', borderRadius: '6px' }}>
                      <strong>{texts[lang].review}:</strong> {r.review}<br />
                      <strong>Hodnocení:</strong> {'★'.repeat(r.stars || 0)}{'☆'.repeat(5 - (r.stars || 0))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <form onSubmit={odeslatRezervaci} style={{ marginBottom: '20px' }}>
              {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
              <input type="text" placeholder={texts[lang].name} value={jmeno} onChange={e => setJmeno(e.target.value)} style={{ marginRight: '10px' }} />
              <input type="email" placeholder={texts[lang].email} value={email} onChange={e => setEmail(e.target.value)} style={{ marginRight: '10px' }} />
              <input type="date" value={termin} onChange={e => setTermin(e.target.value)} style={{ marginRight: '10px' }} />
              <button type="submit">{texts[lang].reservation}</button>
            </form>
            {showPayment && pendingReservation && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
                <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', maxWidth: '350px', margin: '100px auto', textAlign: 'center', boxShadow: '0 2px 8px #0002' }}>
                  <h2>Platba za rezervaci</h2>
                  <p>Rezervace pro <strong>{pendingReservation.jmeno}</strong> na termín <strong>{pendingReservation.termin}</strong></p>
                  <p>Cena: <strong>500 Kč</strong></p>
                  <button onClick={handlePayment} style={{ marginRight: '10px' }}>Zaplatit</button>
                  <button onClick={handleCancelPayment}>{texts[lang].cancel}</button>
                </div>
              </div>
            )}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filterReservations(rezervace.filter(r => r.user === loggedUser)).length === 0 && <li>{texts[lang].noReservations}</li>}
              {filterReservations(rezervace.filter(r => r.user === loggedUser)).map((r, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {editIndex === index ? (
                    <form onSubmit={saveEdit} style={{ display: 'inline-block', marginRight: '10px' }}>
                      <input type="text" value={editJmeno} onChange={e => setEditJmeno(e.target.value)} style={{ marginRight: '5px' }} />
                      <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ marginRight: '5px' }} />
                      <input type="date" value={editTermin} onChange={e => setEditTermin(e.target.value)} style={{ marginRight: '5px' }} />
                      <button type="submit">Uložit</button>
                      <button type="button" onClick={cancelEdit} style={{ marginLeft: '5px' }}>{texts[lang].cancel}</button>
                    </form>
                  ) : (
                    <div>
                      <strong>{r.jmeno}</strong> ({r.email}) - {r.termin}
                      <button style={{ marginLeft: '10px' }} onClick={() => odebratRezervaci(index)}>{texts[lang].delete}</button>
                      <button style={{ marginLeft: '5px' }} onClick={() => startEdit(index)}>{texts[lang].edit}</button>
                      <button style={{ marginLeft: '5px' }} onClick={() => startReview(index)}>{texts[lang].review}</button>
                      {r.review && (
                        <div style={{ marginTop: '5px', background: '#f8f5e9', padding: '6px', borderRadius: '6px' }}>
                          <strong>{texts[lang].review}:</strong> {r.review}<br />
                          <strong>Hodnocení:</strong> {'★'.repeat(r.stars || 0)}{'☆'.repeat(5 - (r.stars || 0))}
                        </div>
                      )}
                      {reviewIndex === index && (
                        <form onSubmit={saveReview} style={{ marginTop: '8px', background: '#eef', padding: '8px', borderRadius: '6px' }}>
                          <label>
                            {texts[lang].review}:<br />
                            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={2} style={{ width: '100%' }} />
                          </label><br />
                          <label>
                            Hodnocení:&nbsp;
                            <select value={reviewStars} onChange={e => setReviewStars(Number(e.target.value))}>
                              {[1,2,3,4,5].map(star => (
                                <option key={star} value={star}>{star} ★</option>
                              ))}
                            </select>
                          </label><br />
                          <button type="submit">{texts[lang].saveReview}</button>
                          <button type="button" onClick={cancelReview} style={{ marginLeft: '5px' }}>{texts[lang].cancel}</button>
                        </form>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <h2>{texts[lang].calendar}</h2>
            <div className="calendar-mountains" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
              {getMonthDates().map(date => {
                const isObsazeno = rezervace.some(r => r.termin === date);
                return (
                  <div key={date} style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: isObsazeno ? '#ffcccc' : '#ccffcc',
                    color: isObsazeno ? '#a00' : '#080',
                    border: '1px solid #ccc',
                    minWidth: '110px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px #0002'
                  }}>
                    {date} <br />
                    <strong>{isObsazeno ? texts[lang].occupied : texts[lang].free}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
      <div className="inspiration">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80" alt="Inspirace les" />
        <div><strong>„Nejkrásnější zážitky jsou ty, které si sami naplánujete."</strong></div>
        <div style={{ fontSize: '0.95rem', marginTop: '8px' }}>Tip: Vydejte se na dovolenou do lesa a objevujte nové stezky!</div>
      </div>
    </div>
  );
}

export default App;
