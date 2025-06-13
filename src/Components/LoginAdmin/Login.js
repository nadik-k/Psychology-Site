import "./Login.css";

function Login({ data }) {
  return (
    <div className="lg-page">
      <div className="block-lg-page">
        <h1 className="t-lg-page">Привіт, Адмін!</h1>
        <h3 className="st-lg-page">
          Увійдіть до системи під відповідним логіном та паролем. Гарного дня!
        </h3>
        <input className="inp-lg-page" type="text" placeholder="Логін"></input>
        <input
          className="inp-lg-page"
          type="password"
          placeholder="Пароль"
        ></input>
        <button className="btn-login-page">Увійти</button>
      </div>
    </div>
  );
}

export default Login;
