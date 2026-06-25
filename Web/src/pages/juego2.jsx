function juegos2() {
  return (
    <div className="juego-detail-section">
      <div className="juego-detail-content">
        <h1 className="juego-detail-heading">Juego 2: LÓGICA</h1>
        <p className="juego-detail-paragraph">
          En este juego deberas clasificar objetos por forma, color o tamaño.
        </p>

        <img
          src={require("../img/pictograma2.png")}
          width="600"
          height="200"
          alt="Pictograma de clasificación"
          className="juego-detail-image pictograma"
        />

        <a
          href="https://scratch.mit.edu/explore/projects/all"
          className="juego-detail-link"
          target="_blanck"
        >
          ABRIR JUEGO 2 NÚMEROS
        </a>

        <img
          src={require("../img/captura del juego.png")}
          width="650"
          height="400"
          alt="Captura del Juego 2"
          className="juego-detail-image captura"
        />
      </div>
    </div>
  );
}

export default juegos2;
