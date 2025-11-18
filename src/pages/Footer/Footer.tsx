import "./Footer.css";

export default function Footer() {
  return (
    <footer className="z-3">
      <div className="row gx-0 footer-start align-items-center">
        <div className="col ms-5">
          <img src="assets/logoConsob2.svg" alt="consob logo" />
        </div>
        <div className="col-auto ms-auto">
          <a href="#" className="link">
            Informativa privacy
          </a>
        </div>
        <div className="col-auto">
          <a href="#" className="link">
            Diritto alla protezione dei dati personali
          </a>
        </div>
        <div className="col-auto me-5">
          <a href="#" className="link">
            Termini e condizioni
          </a>
        </div>
      </div>
      <div className="row gx-0 footer-end align-items-center">
        <div className="col text-center">
          <span className="bold-text-14">CONSOB </span> - Commissione nazionale
          per le società e la borsa
        </div>
      </div>
    </footer>
  );
}
