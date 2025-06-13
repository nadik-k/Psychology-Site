import "./Accounts.css";

function Accounts({ data }) {
  return (
    <div className="acc-block">
      <div className="accounts-list">
        <div className="acc-card">
          <img srcSet="/picture1.jpg" alt="Катерина Соловейко" />
          <h3>Катерина Соловейко</h3>
          <p>Психолог</p>
          <button className="bnt-del">Заблокувати</button>
        </div>

        <div className="acc-card">
          <img srcSet="/picture2.jpg" alt="Катерина Соловейко" />
          <h3>Катерина Соловейко</h3>
          <p>Психолог</p>
          <button className="bnt-del">Заблокувати</button>
        </div>

        <div className="acc-card">
          <img srcSet="/picture3.jpg" alt="Катерина Соловейко" />
          <h3>Катерина Соловейко</h3>
          <p>Психолог</p>
          <button className="bnt-del">Заблокувати</button>
        </div>

        <div className="acc-card">
          <img srcSet="/picture4.jpg" alt="Катерина Соловейко" />
          <h3>Катерина Соловейко</h3>
          <p>Психолог</p>
          <button className="bnt-del">Заблокувати</button>
        </div>

        <div className="acc-card">
          <img srcSet="/picture5.jpg" alt="Катерина Соловейко" />
          <h3>Катерина Соловейко</h3>
          <p>Психолог</p>
          <button className="bnt-del">Заблокувати</button>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
