import "../styles/HomePage.css";
function HomePage() {
  return (
    <div className="mundo-azul-page">
      <main className="mundo-azul-main">
        <img
          src={require("../img/logo.JPG")}
          alt="Imagen de Mundo Azul"
          className="main-image"
        />
        <h1 className="main-heading">BIENVENIDOS A MUNDO AZUL</h1>
        <div className="main-paragraph-container">
          {/* Se reemplaza <p1> por un div con clase para styling */}
          ESTA PAGINA WEB HA SIDO REALIZADO POR LOS ESTUDIANTES DEL TERCIARIO
          IES N°6039 CON EL OBJETIVO DE ACOMPAÑAR EL DESARROLLO COGNITIVO DEL
          NIÑO CON AUTISMO, SE HA OBSERVADO UN INCREMENTO CONSIDERABLE EN LA
          NECESIDAD DE RECURSOS EDUCATIVOS ESPECIALIZADOS, YA QUE EXISTEN
          VARIEDADES DE CASOS Y ESCASES DE MÉTODOS EFECTIVOS DE ENSEÑANZA.
          BUSCAMOS LA MEJOR MANERA DE AYUDAR A QUE LOS NIÑOS APRENDAN DE FORMA
          DIDÁCTICA Y DIVERTIDA MEDIANTE DISTINTOS JUEGOS DISEÑADOS
          ESPECÍFICAMENTE EN ELLOS.
        </div>
      </main>
    </div>
  );
}

export default HomePage;
