import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [anvandareInfo, setAnvandareInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [aktivSida, setAktivSida] = useState('hem');
  const [mobilMenyOppen, setMobilMenyOppen] = useState(false);

  const [brukare, setBrukare] = useState([]);
  const [aktivBrukareId, setAktivBrukareId] = useState('');
  const [personalNamn, setPersonalNamn] = useState('');
  
  const [anteckningar, setAnteckningar] = useState([]);
  const [avvikelser, setAvvikelser] = useState([]);
  const [lakemedel, setLakemedel] = useState([]);
  const [medicinSigneringar, setMedicinSigneringar] = useState([]);
  const [chatt, setChatt] = useState([]);
  const [rutiner, setRutiner] = useState([]);
  const [arbetspassLista, setArbetspassLista] = useState([]);
  const [brukareKalender, setBrukareKalender] = useState([]);

  // Formulär för Läkemedel
  const [medicinNamn, setMedicinNamn] = useState('');
  const [medicinDosering, setMedicinDosering] = useState('');
  const [medicinTider, setMedicinTider] = useState('');

  // Formulär för Arbetspass
  const [passDatum, setPassDatum] = useState('');
  const [passPersonal, setPassPersonal] = useState('');
  const [passTyp, setPassTyp] = useState('dag');
  const [passStart, setPassStart] = useState('07:00');
  const [passSlut, setPassSlut] = useState('15:30');

  // Formulär för Brukarhändelse
  const [handelseTitel, setHandelseTitel] = useState('');
  const [handelseDatum, setHandelseDatum] = useState(() => {
    const nu = new Date();
    return `${nu.getFullYear()}-${String(nu.getMonth() + 1).padStart(2, '0')}-${String(nu.getDate()).padStart(2, '0')}`;
  });
  const [handelseTid, setHandelseTid] = useState('10:00');
  const [handelsePlats, setHandelsePlats] = useState('');
  const [handelseBeskrivning, setHandelseBeskrivning] = useState('');

  const [nyttBrukareNamn, setNyttBrukareNamn] = useState('');
  const [nyttPersonnummer, setNyttPersonnummer] = useState('');
  const [nyGenomforandeplan, setNyGenomforandeplan] = useState('');
  const [nyAnhorig, setNyAnhorig] = useState('');
  const [rutinTitel, setRutinTitel] = useState('');
  const [rutinBeskrivning, setRutinBeskrivning] = useState('');

  const [mall, setMall] = useState('vardag');
  const [anteckningText, setAnteckningText] = useState('');
  const [avvikelseRubrik, setAvvikelseRubrik] = useState('');
  const [avvikelseBeskrivning, setAvvikelseBeskrivning] = useState('');
  const [allvarlighetsgrad, setAllvarlighetsgrad] = useState('lag');
  const [chattText, setChattText] = useState('');

  useEffect(() => {
    if (token) {
      hämtaAllData();
    }
  }, [token]);

  const hämtaAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const profilRes = await axios.get('http://127.0.0.1:8000/api/min-profil/', { headers });
      setAnvandareInfo(profilRes.data);
      if (profilRes.data && profilRes.data.username) {
        setPersonalNamn(profilRes.data.username);
        if (!passPersonal) setPassPersonal(profilRes.data.username);
      }

      const brukareRes = await axios.get('http://127.0.0.1:8000/api/brukare/', { headers });
      setBrukare(brukareRes.data);
      if (brukareRes.data.length > 0 && !aktivBrukareId) {
        setAktivBrukareId(brukareRes.data[0].id);
      }

      const antRes = await axios.get('http://127.0.0.1:8000/api/anteckningar/', { headers });
      setAnteckningar(antRes.data);

      const avvRes = await axios.get('http://127.0.0.1:8000/api/avvikelser/', { headers });
      setAvvikelser(avvRes.data);

      const lakRes = await axios.get('http://127.0.0.1:8000/api/lakemedel/', { headers });
      setLakemedel(lakRes.data);

      try {
        const signRes = await axios.get('http://127.0.0.1:8000/api/medicin-signeringar/', { headers });
        setMedicinSigneringar(signRes.data);
      } catch (e) {
        console.log("Signeringar kunde inte hämtas ännu");
      }

      const rutinRes = await axios.get('http://127.0.0.1:8000/api/brukare-rutiner/', { headers });
      setRutiner(rutinRes.data);

      const passRes = await axios.get('http://127.0.0.1:8000/api/arbetspass/', { headers });
      setArbetspassLista(passRes.data);

      const kalRes = await axios.get('http://127.0.0.1:8000/api/brukare-kalender/', { headers });
      setBrukareKalender(kalRes.data);

      const chattRes = await axios.get('http://127.0.0.1:8000/api/chatt/', { headers });
      setChatt(chattRes.data);

    } catch (error) {
      console.error("Fel vid hämtning av data:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      setToken(response.data.access);
    } catch (error) {
      setErrorMsg('Felaktigt användarnamn eller lösenord.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken('');
    setAnvandareInfo(null);
  };

  const skapaLakemedel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/lakemedel/', {
        brukare: aktivBrukareId,
        namn: medicinNamn,
        dosering: medicinDosering,
        tider: medicinTider
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMedicinNamn(''); setMedicinDosering(''); setMedicinTider('');
      await hämtaAllData();
      alert('Ny medicinordination tillagd för brukaren.');
    } catch (err) {
      console.error("Fel vid skapande av medicin:", err);
      alert('Kunde inte lägga till medicinen.');
    }
  };

  const signeraMedicin = async (lakemedelId) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/medicin-signeringar/', {
        lakemedel: lakemedelId, personal_namn: personalNamn, status: 'Givet'
      }, { headers: { Authorization: `Bearer ${token}` } });
      await hämtaAllData();
    } catch (err) { console.error(err); }
  };

  const skapaArbetspass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/arbetspass/', {
        personal_namn: passPersonal, datum: passDatum, typ: passTyp, start_tid: passStart, sluttid: passSlut, bekräftad: true
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPassDatum('');
      hämtaAllData();
      alert('Arbetspass inbokat.');
    } catch (err) { console.error(err); }
  };

  const skapaBrukarHandelse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/brukare-kalender/', {
        brukare: aktivBrukareId, titel: handelseTitel, datum: handelseDatum, tid: handelseTid, plats: handelsePlats, beskrivning: handelseBeskrivning
      }, { headers: { Authorization: `Bearer ${token}` } });
      setHandelseTitel(''); setHandelsePlats(''); setHandelseBeskrivning('');
      await hämtaAllData();
      alert('Kalenderhändelse tillagd för brukaren.');
    } catch (err) { console.error(err); }
  };

  const skapaBrukare = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/brukare/', {
        namn: nyttBrukareNamn, personnummer: nyttPersonnummer, genomforandeplan: nyGenomforandeplan, anhorig_kontakt: nyAnhorig
      }, { headers: { Authorization: `Bearer ${token}` } });
      setNyttBrukareNamn(''); setNyttPersonnummer(''); setNyGenomforandeplan(''); setNyAnhorig('');
      hämtaAllData();
      alert('Ny brukare sparad.');
    } catch (err) { console.error(err); }
  };

  const skapaRutin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/brukare-rutiner/', {
        brukare: aktivBrukareId, titel: rutinTitel, beskrivning: rutinBeskrivning, utford_idag: false
      }, { headers: { Authorization: `Bearer ${token}` } });
      setRutinTitel(''); setRutinBeskrivning('');
      hämtaAllData();
    } catch (err) { console.error(err); }
  };

  const togglaRutin = async (rutin) => {
    try {
      const nuLokalt = new Date();
      const lokalTidStämpel = `${nuLokalt.getFullYear()}-${String(nuLokalt.getMonth() + 1).padStart(2, '0')}-${String(nuLokalt.getDate()).padStart(2, '0')}T${String(nuLokalt.getHours()).padStart(2, '0')}:${String(nuLokalt.getMinutes()).padStart(2, '0')}:${String(nuLokalt.getSeconds()).padStart(2, '0')}`;

      await axios.patch(`http://127.0.0.1:8000/api/brukare-rutiner/${rutin.id}/`, {
        utford_idag: !rutin.utford_idag,
        utford_av: personalNamn,
        senast_utford_tid: lokalTidStämpel
      }, { headers: { Authorization: `Bearer ${token}` } });
      hämtaAllData();
    } catch (err) { console.error(err); }
  };

  const skickaAnteckning = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/anteckningar/', {
        brukare: aktivBrukareId, personal_namn: personalNamn, mall, text: anteckningText
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAnteckningText('');
      hämtaAllData();
      alert('Anteckning sparad.');
    } catch (err) { console.error(err); }
  };

  const skickaAvvikelse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/avvikelser/', {
        brukare: aktivBrukareId, personal_namn: personalNamn, rubrik: avvikelseRubrik, beskrivning: avvikelseBeskrivning, allvarlighetsgrad
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAvvikelseRubrik(''); setAvvikelseBeskrivning('');
      hämtaAllData();
      alert('Avvikelse rapporterad.');
    } catch (err) { console.error(err); }
  };

  const skickaChatt = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/chatt/', {
        avsandare: personalNamn, mottagargrupp: 'alla', meddelande: chattText
      }, { headers: { Authorization: `Bearer ${token}` } });
      setChattText('');
      hämtaAllData();
    } catch (err) { console.error(err); }
  };

  if (!token) {
    return (
      <div className="bg-light d-flex justify-content-center align-items-center vh-100 px-3">
        <div className="card shadow-sm p-4 border-0 w-100" style={{ maxWidth: '380px', borderRadius: '12px' }}>
          <h2 className="text-center fw-bold mb-1 text-primary">CareNote</h2>
          <p className="text-center text-muted small mb-4">Logga in på plattformen</p>
          {errorMsg && <div className="alert alert-danger py-2 small text-center">{errorMsg}</div>}
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <input type="text" placeholder="Användarnamn" value={username} onChange={(e) => setUsername(e.target.value)} required className="form-control" />
            <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
            <button type="submit" className="btn btn-primary fw-bold mt-2">Logga in</button>
          </form>
        </div>
      </div>
    );
  }

  const roll = anvandareInfo ? anvandareInfo.roll : 'personal';
  const aktivBrukareObjekt = brukare.find(b => b.id === Number(aktivBrukareId));
  const aktivaRutiner = rutiner.filter(r => Number(r.brukare) === Number(aktivBrukareId));
  const aktivaLakemedel = lakemedel.filter(l => Number(l.brukare) === Number(aktivBrukareId));
  const aktivaHandelser = brukareKalender.filter(h => Number(h.brukare) === Number(aktivBrukareId));

  const nu = new Date();
  const idagDatumStr = `${nu.getFullYear()}-${String(nu.getMonth() + 1).padStart(2, '0')}-${String(nu.getDate()).padStart(2, '0')}`;
  
  const dagensAnteckningar = anteckningar.filter(a => a.brukare === Number(aktivBrukareId) && a.skapad_datum && a.skapad_datum.startsWith(idagDatumStr));
  const dagensAvvikelser = avvikelser.filter(avv => avv.brukare === Number(aktivBrukareId) && avv.skapad_datum && avv.skapad_datum.startsWith(idagDatumStr));
  const dagensHandelser = aktivaHandelser.filter(h => h.datum && String(h.datum).substring(0, 10) === idagDatumStr);

  const kommandeVeckaDatum = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(nu);
    d.setDate(nu.getDate() + i);
    const ar = d.getFullYear();
    const man = String(d.getMonth() + 1).padStart(2, '0');
    const dag = String(d.getDate()).padStart(2, '0');
    kommandeVeckaDatum.push(`${ar}-${man}-${dag}`);
  }

  const bytSida = (sida) => {
    setAktivSida(sida);
    setMobilMenyOppen(false);
  };

  return (
    <div className="min-vh-100 bg-light text-dark">
      
      {/* MOBIL TOPPBAR */}
      <div className="d-flex d-md-none bg-white border-bottom p-3 justify-content-between align-items-center sticky-top shadow-sm">
        <div>
          <h5 className="fw-bold text-primary m-0">CareNote</h5>
          <small className="text-muted text-capitalize">Sida: {aktivSida}</small>
        </div>
        <button onClick={() => setMobilMenyOppen(!mobilMenyOppen)} className="btn btn-outline-primary btn-sm">
          {mobilMenyOppen ? 'Stäng' : 'Meny'}
        </button>
      </div>

      {/* MOBIL MENY DROPDOWN */}
      {mobilMenyOppen && (
        <div className="mobil-dropdown p-3 d-md-none shadow-sm">
          <ul className="nav nav-pills flex-column gap-2">
            <button onClick={() => bytSida('hem')} className={`btn text-start ${aktivSida === 'hem' ? 'btn-primary text-white' : 'btn-light'}`}>Hem</button>
            <button onClick={() => bytSida('schema')} className={`btn text-start ${aktivSida === 'schema' ? 'btn-primary text-white' : 'btn-light'}`}>Schema & Kalender</button>
            <button onClick={() => bytSida('rutiner')} className={`btn text-start ${aktivSida === 'rutiner' ? 'btn-primary text-white' : 'btn-light'}`}>Rutiner & Medicin</button>
            <button onClick={() => bytSida('anteckningar')} className={`btn text-start ${aktivSida === 'anteckningar' ? 'btn-primary text-white' : 'btn-light'}`}>Anteckningar</button>
            <button onClick={() => bytSida('avvikelser')} className={`btn text-start ${aktivSida === 'avvikelser' ? 'btn-primary text-white' : 'btn-light'}`}>Avvikelser</button>
            <button onClick={() => bytSida('chatt')} className={`btn text-start ${aktivSida === 'chatt' ? 'btn-primary text-white' : 'btn-light'}`}>Kommunikation</button>
            {(roll === 'samordnare' || roll === 'chef') && (
              <button onClick={() => bytSida('admin')} className={`btn text-start ${aktivSida === 'admin' ? 'btn-primary text-white' : 'btn-light'}`}>Administration</button>
            )}
            <button onClick={handleLogout} className="btn btn-outline-danger mt-2">Logga ut</button>
          </ul>
        </div>
      )}

      {/* FAST SIDOMENY FÖR DESKTOP */}
      <div className="bg-white border-end d-none d-md-flex flex-column p-3 sidebar-desktop">
        <div className="mb-4 px-2">
          <h5 className="fw-bold text-primary m-0">CareNote</h5>
          <small className="text-muted">Vårdplattform</small>
        </div>

        <ul className="nav nav-pills flex-column gap-1 mb-auto">
          <li className="nav-item">
            <button onClick={() => bytSida('hem')} className={`nav-link w-100 text-start ${aktivSida === 'hem' ? 'active bg-primary text-white' : 'text-dark'}`}>Hem</button>
          </li>
          <li className="nav-item">
            <button onClick={() => bytSida('schema')} className={`nav-link w-100 text-start ${aktivSida === 'schema' ? 'active bg-primary text-white' : 'text-dark'}`}>Schema & Kalender</button>
          </li>
          <li className="nav-item">
            <button onClick={() => bytSida('rutiner')} className={`nav-link w-100 text-start ${aktivSida === 'rutiner' ? 'active bg-primary text-white' : 'text-dark'}`}>Rutiner & Medicin</button>
          </li>
          <li className="nav-item">
            <button onClick={() => bytSida('anteckningar')} className={`nav-link w-100 text-start ${aktivSida === 'anteckningar' ? 'active bg-primary text-white' : 'text-dark'}`}>Anteckningar</button>
          </li>
          <li className="nav-item">
            <button onClick={() => bytSida('avvikelser')} className={`nav-link w-100 text-start ${aktivSida === 'avvikelser' ? 'active bg-primary text-white' : 'text-dark'}`}>Avvikelser</button>
          </li>
          <li className="nav-item">
            <button onClick={() => bytSida('chatt')} className={`nav-link w-100 text-start ${aktivSida === 'chatt' ? 'active bg-primary text-white' : 'text-dark'}`}>Kommunikation</button>
          </li>
          {(roll === 'samordnare' || roll === 'chef') && (
            <li className="nav-item">
              <button onClick={() => bytSida('admin')} className={`nav-link w-100 text-start ${aktivSida === 'admin' ? 'active bg-primary text-white' : 'text-dark'}`}>Administration</button>
            </li>
          )}
        </ul>

        <div className="border-top pt-3 mt-auto">
          <div className="small fw-bold">{anvandareInfo?.username}</div>
          <span className="badge bg-secondary mb-2">{roll.toUpperCase()}</span>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">Logga ut</button>
        </div>
      </div>

      {/* HUVUDINNEHÅLL */}
      <div className="main-content p-3 p-md-4">
        
        {/* Toppheader med brukarväljare */}
        <div className="bg-white border rounded-3 p-3 mb-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h4 className="fw-bold m-0 text-capitalize">{aktivSida}</h4>
            <small className="text-muted">Aktiv brukare i fokus</small>
          </div>
          <div>
            <select value={aktivBrukareId} onChange={(e) => setAktivBrukareId(e.target.value)} className="form-select form-select-sm fw-bold">
              {brukare.map(b => <option key={b.id} value={b.id}>{b.namn} ({b.personnummer})</option>)}
            </select>
          </div>
        </div>

        {/* 1. HEM / ÖVERSIKT */}
        {aktivSida === 'hem' && (
          <div className="row g-4">
            
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-3">Idag</h5>
                <p className="text-muted small">{idagDatumStr}</p>
                <hr />
                <h6 className="fw-bold">Aktuell brukare:</h6>
                <p className="mb-1"><strong>{aktivBrukareObjekt?.namn}</strong></p>
                <p className="text-muted small mb-3">Personnummer: {aktivBrukareObjekt?.personnummer}</p>
                <p className="text-muted small mb-4">Genomförandeplan: {aktivBrukareObjekt?.genomforandeplan || 'Ej angiven'}</p>

                <div className="p-3 bg-light rounded-3 border">
                  <h6 className="fw-bold text-primary small mb-2">Inbokat för brukaren idag:</h6>
                  {dagensHandelser.length === 0 ? (
                    <p className="text-muted small mb-0">Inga särskilda aktiviteter inbokade idag.</p>
                  ) : (
                    <ul className="list-unstyled mb-0 small">
                      {dagensHandelser.map(h => (
                        <li key={h.id} className="mb-1">
                          <strong>{h.tid || 'Hela dagen'}</strong>: {h.titel} {h.plats ? `(${h.plats})` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8 d-flex flex-column gap-4">
              
              {/* 1 VECKAS SCHEMA */}
              <div className="card border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0">Kommande 7 dagars schema & kollegor</h5>
                  <button onClick={() => setAktivSida('schema')} className="btn btn-sm btn-outline-primary">Visa hela schemat →</button>
                </div>
                <div className="list-group list-group-flush">
                  {kommandeVeckaDatum.map(datum => {
                    const passDennaDag = arbetspassLista.filter(p => p.datum === datum);
                    return (
                      <div key={datum} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <span className="small fw-bold">{datum} {datum === idagDatumStr && <span className="badge bg-success ms-1">Idag</span>}</span>
                        <div>
                          {passDennaDag.length === 0 ? (
                            <span className="text-muted small">Inga inbokade pass</span>
                          ) : (
                            passDennaDag.map(p => (
                              <span key={p.id} className="badge bg-light text-dark border me-1 small">
                                {p.personal_namn} ({p.typ}: {p.start_tid}-{p.sluttid})
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dagens Rutiner */}
              <div className="card border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0">Dagens Rutiner</h5>
                  <span className="badge bg-primary">{aktivaRutiner.filter(r => r.utford_idag).length} / {aktivaRutiner.length} klara</span>
                </div>
                {aktivaRutiner.length === 0 ? <p className="text-muted small mb-0">Inga rutiner inlagda.</p> : (
                  <ul className="list-unstyled mb-0">
                    {aktivaRutiner.map(rutin => (
                      <li key={rutin.id} className="p-3 mb-2 bg-light border rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                        <div>
                          <strong className={rutin.utford_idag ? 'text-decoration-line-through text-muted' : ''}>{rutin.titel}</strong>
                          <p className="small text-muted mb-0">{rutin.beskrivning}</p>
                        </div>
                        <button 
                          onClick={() => togglaRutin(rutin)} 
                          className={`btn btn-sm fw-bold ${rutin.utford_idag ? 'btn-secondary' : 'btn-success'}`}
                        >
                          {rutin.utford_idag ? 'Ångra' : 'Klar'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dagens Mediciner på Hem */}
              <div className="card border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0">Dagens Medicinordinationer</h5>
                  <button onClick={() => setAktivSida('rutiner')} className="btn btn-sm btn-outline-primary">Gå till alla mediciner →</button>
                </div>
                {aktivaLakemedel.length === 0 ? (
                  <p className="text-muted small mb-0">Inga aktiva medicinordinationer för denna brukare.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {aktivaLakemedel.map(l => {
                      const arSigneradIdag = medicinSigneringar.some(s => {
                        if (Number(s.lakemedel) !== Number(l.id)) return false;
                        const tidPunkt = s.signerad_tid || s.skapad_datum || '';
                        return tidPunkt.startsWith(idagDatumStr);
                      });

                      return (
                        <li key={l.id} className={`p-3 mb-2 border rounded-3 d-flex justify-content-between align-items-center ${arSigneradIdag ? 'bg-light text-muted' : 'bg-white'}`}>
                          <div>
                            <strong className={arSigneradIdag ? 'text-decoration-line-through text-muted' : ''}>{l.namn}</strong>
                            <p className="small mb-0">Dos: {l.dosering} | Tider: {l.tider}</p>
                            {arSigneradIdag && <small className="text-success d-block mt-1">Signerad idag</small>}
                          </div>
                          <button 
                            onClick={() => signeraMedicin(l.id)} 
                            disabled={arSigneradIdag}
                            className={`btn btn-sm fw-bold ${arSigneradIdag ? 'btn-secondary disabled' : 'btn-primary'}`}
                          >
                            {arSigneradIdag ? 'Signerad' : 'Signera'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2. SCHEMA & KALENDER */}
        {aktivSida === 'schema' && (
          <div className="row g-4">
            {(roll === 'chef' || roll === 'samordnare') && (
              <div className="col-12">
                <div className="card border-0 shadow-sm p-4 bg-white border-start border-primary border-4">
                  <h5 className="fw-bold mb-3">Skapa Arbetspass (Personal)</h5>
                  <form onSubmit={skapaArbetspass} className="row g-3 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label small text-muted">Personalnamn</label>
                      <input type="text" value={passPersonal} onChange={(e) => setPassPersonal(e.target.value)} required className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted">Datum</label>
                      <input type="date" value={passDatum} onChange={(e) => setPassDatum(e.target.value)} required className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small text-muted">Passtyp</label>
                      <select value={passTyp} onChange={(e) => setPassTyp(e.target.value)} className="form-select">
                        <option value="dag">Dagpass</option>
                        <option value="kväll">Kvällspass</option>
                        <option value="natt">Nattpass</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small text-muted">Tid</label>
                      <div className="d-flex gap-1">
                        <input type="time" value={passStart} onChange={(e) => setPassStart(e.target.value)} className="form-control px-1" />
                        <input type="time" value={passSlut} onChange={(e) => setPassSlut(e.target.value)} className="form-control px-1" />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary w-100 fw-bold">Boka pass</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {(roll === 'chef' || roll === 'samordnare') && (
              <div className="col-12">
                <div className="card border-0 shadow-sm p-4 bg-white border-start border-success border-4">
                  <h5 className="fw-bold mb-3">Lägg till Kalenderhändelse för Brukare ({aktivBrukareObjekt?.namn})</h5>
                  <form onSubmit={skapaBrukarHandelse} className="row g-3 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label small text-muted">Händelse / Aktivitet</label>
                      <input type="text" placeholder="T.ex. Tandläkarbesök" value={handelseTitel} onChange={(e) => setHandelseTitel(e.target.value)} required className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small text-muted">Datum</label>
                      <input type="date" value={handelseDatum} onChange={(e) => setHandelseDatum(e.target.value)} required className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small text-muted">Tid</label>
                      <input type="time" value={handelseTid} onChange={(e) => setHandelseTid(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted">Plats</label>
                      <input type="text" placeholder="T.ex. Centrala Sjukhuset" value={handelsePlats} onChange={(e) => setHandelsePlats(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-success w-100 fw-bold">Spara händelse</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-3">Brukarens Kalender & Aktiviteter</h5>
                {aktivaHandelser.length === 0 ? (
                  <p className="text-muted small">Inga inbokade händelser för denna brukare.</p>
                ) : (
                  <ul className="list-unstyled">
                    {aktivaHandelser.map(h => (
                      <li key={h.id} className="p-3 mb-2 bg-white border rounded shadow-sm">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-1 mb-1">
                          <strong className="text-dark">{h.titel}</strong>
                          <span className="badge bg-info text-dark align-self-start">{h.datum} {h.tid ? `kl ${h.tid}` : ''}</span>
                        </div>
                        {h.plats && <small className="text-muted d-block mt-1">Plats: {h.plats}</small>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-3">Personalschema & Kollegor</h5>
                {arbetspassLista.length === 0 ? (
                  <p className="text-muted small">Inga arbetspass inbokade.</p>
                ) : (
                  <ul className="list-unstyled">
                    {arbetspassLista.map(pass => (
                      <li key={pass.id} className="p-2 mb-2 bg-white border rounded small d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{pass.datum}</strong> - <span className="text-primary">{pass.personal_namn}</span> ({pass.typ})
                        </div>
                        <span className="text-muted">{pass.start_tid}-{pass.sluttid}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. RUTINER & MEDICIN */}
        {aktivSida === 'rutiner' && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Dagliga Rutiner</h5>
                {aktivaRutiner.map(rutin => (
                  <div key={rutin.id} className="p-3 mb-2 bg-white border rounded shadow-sm d-flex justify-content-between align-items-center">
                    <div>
                      <strong className={rutin.utford_idag ? 'text-decoration-line-through text-muted' : ''}>{rutin.titel}</strong>
                      <p className="small text-muted mb-0">{rutin.beskrivning}</p>
                    </div>
                    <button onClick={() => togglaRutin(rutin)} className={`btn btn-sm ${rutin.utford_idag ? 'btn-secondary' : 'btn-success'}`}>
                      {rutin.utford_idag ? 'Ångra' : 'Klar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Medicinordinationer & Signering</h5>
                <p className="text-muted small">Aktiva ordinationer för {aktivBrukareObjekt?.namn}:</p>
                {aktivaLakemedel.length === 0 ? (
                  <p className="text-muted small">Inga aktiva ordinationer inlagda för denna brukare.</p>
                ) : (
                  <ul className="list-unstyled">
                    {aktivaLakemedel.map(l => {
                      const arSigneradIdag = medicinSigneringar.some(s => {
                        if (Number(s.lakemedel) !== Number(l.id)) return false;
                        const tidPunkt = s.signerad_tid || s.skapad_datum || '';
                        return tidPunkt.startsWith(idagDatumStr);
                      });

                      return (
                        <li key={l.id} className={`p-3 mb-2 border rounded shadow-sm d-flex justify-content-between align-items-center ${arSigneradIdag ? 'bg-light text-muted' : 'bg-white'}`}>
                          <div>
                            <strong className={arSigneradIdag ? 'text-decoration-line-through text-muted' : ''}>{l.namn}</strong>
                            <p className="small mb-0">Dos: {l.dosering} | Tider: {l.tider}</p>
                            {arSigneradIdag && <small className="text-success d-block mt-1">Signerad idag</small>}
                          </div>
                          <button 
                            onClick={() => signeraMedicin(l.id)} 
                            disabled={arSigneradIdag}
                            className={`btn btn-sm fw-bold ${arSigneradIdag ? 'btn-secondary disabled' : 'btn-primary'}`}
                          >
                            {arSigneradIdag ? 'Signerad' : 'Signera'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. ANTECKNINGAR */}
        {aktivSida === 'anteckningar' && (
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Skriv Ny Anteckning</h5>
            <form onSubmit={skickaAnteckning} className="d-flex flex-column gap-3">
              <select value={mall} onChange={(e) => setMall(e.target.value)} className="form-select">
                <option value="vardag">Vardaglig händelse</option>
                <option value="omvårdnad">Omvårdnad & Hygien</option>
              </select>
              <textarea placeholder="Skriv anteckning..." value={anteckningText} onChange={(e) => setAnteckningText(e.target.value)} required rows="4" className="form-control" />
              <button type="submit" className="btn btn-primary">Spara</button>
            </form>
          </div>
        )}

        {/* 5. AVVIKELSER */}
        {aktivSida === 'avvikelser' && (
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Rapportera Avvikelse</h5>
            <form onSubmit={skickaAvvikelse} className="d-flex flex-column gap-3">
              <input type="text" placeholder="Rubrik" value={avvikelseRubrik} onChange={(e) => setAvvikelseRubrik(e.target.value)} required className="form-control" />
              <select value={allvarlighetsgrad} onChange={(e) => setAllvarlighetsgrad(e.target.value)} className="form-select">
                <option value="lag">Låg</option>
                <option value="medel">Medel</option>
                <option value="hog">Hög</option>
              </select>
              <textarea placeholder="Beskrivning..." value={avvikelseBeskrivning} onChange={(e) => setAvvikelseBeskrivning(e.target.value)} required rows="3" className="form-control" />
              <button type="submit" className="btn btn-danger">Skicka</button>
            </form>
          </div>
        )}

        {/* 6. CHATT */}
        {aktivSida === 'chatt' && (
          <div className="card border-0 shadow-sm p-4 d-flex flex-column" style={{ height: '500px' }}>
            <h5 className="fw-bold mb-3">Kommunikation</h5>
            <div className="flex-grow-1 overflow-auto bg-light border p-3 rounded mb-3">
              {chatt.slice().reverse().map(c => (
                <div key={c.id} className="card p-2 mb-2 border-0 shadow-sm">
                  <small className="text-muted"><strong>{c.avsandare}</strong></small>
                  <p className="mb-0 small">{c.meddelande}</p>
                </div>
              ))}
            </div>
            <form onSubmit={skickaChatt} className="d-flex gap-2">
              <input type="text" placeholder="Skriv meddelande..." value={chattText} onChange={(e) => setChattText(e.target.value)} required className="form-control" />
              <button type="submit" className="btn btn-primary">Skicka</button>
            </form>
          </div>
        )}

        {/* ADMIN */}
        {aktivSida === 'admin' && (roll === 'samordnare' || roll === 'chef') && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Lägg till ny Brukare</h5>
                <form onSubmit={skapaBrukare} className="d-flex flex-column gap-3">
                  <input type="text" placeholder="Fullständigt namn" value={nyttBrukareNamn} onChange={(e) => setNyttBrukareNamn(e.target.value)} required className="form-control" />
                  <input type="text" placeholder="Personnummer" value={nyttPersonnummer} onChange={(e) => setNyttPersonnummer(e.target.value)} required className="form-control" />
                  <textarea placeholder="Genomförandeplan..." value={nyGenomforandeplan} onChange={(e) => setNyGenomforandeplan(e.target.value)} rows="2" className="form-control" />
                  <textarea placeholder="Anhörigkontakt..." value={nyAnhorig} onChange={(e) => setNyAnhorig(e.target.value)} rows="2" className="form-control" />
                  <button type="submit" className="btn btn-success">Spara brukare</button>
                </form>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Lägg till Medicinordination för ({aktivBrukareObjekt?.namn})</h5>
                <form onSubmit={skapaLakemedel} className="d-flex flex-column gap-3">
                  <input type="text" placeholder="Läkemedelsnamn (t.ex. Alvedon)" value={medicinNamn} onChange={(e) => setMedicinNamn(e.target.value)} required className="form-control" />
                  <input type="text" placeholder="Dosering (t.ex. 1 tablett)" value={medicinDosering} onChange={(e) => setMedicinDosering(e.target.value)} required className="form-control" />
                  <input type="text" placeholder="Tider (t.ex. Morgon, Kväll)" value={medicinTider} onChange={(e) => setMedicinTider(e.target.value)} required className="form-control" />
                  <button type="submit" className="btn btn-primary fw-bold">Spara ordination</button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
