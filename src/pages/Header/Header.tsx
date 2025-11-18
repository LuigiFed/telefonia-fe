import React, { useEffect, useRef } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { DropdownButton } from "../../components/Buttons";
import { useUserRole } from "../../context/UserRoleContext";

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const { role } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateVar = () => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--header-height",
        `${Math.round(rect.height)}px`
      );
    };

    updateVar();
    window.addEventListener("resize", updateVar);
    return () => window.removeEventListener("resize", updateVar);
  }, []);

  return (
    <header ref={headerRef} className="container-fluid sticky-top">
      <div className="row white-band align-items-center pe-5">
        <div className="col-auto bold-text-14 ms-5">
         Applicazione gestione materiale dispositivi di telefonia mobile 
        </div>

        <div className="col-auto ms-auto p-0">
     
        </div>

        {window.location.pathname === "/elencoTelefonico" ||
        window.location.pathname === "/mappa" ? null : (
          <>
            <div className="col-auto p-0">
              {role === "admin" && (
                <DropdownButton
                  label="Menu gestione"
                  actions={[
                    { label: "Modelli Dispositivi", onClick: () => navigate("/menu-gestione/device-models") },
                    { label: "Tipi Dispositivi", onClick: () => navigate("/menu-gestione/device-types") },
                    { label: "Stato Dispositivi", onClick: () => navigate("/menu-gestione/device-status") },
                    { label: "Gestori Telefonia", onClick: () => navigate("/menu-gestione/mobile-providers") },
                    { label: "Tipologie Servizio", onClick: () => navigate("/menu-gestione/service-type") },
                    { label: "Convenzioni Dispositivi", onClick: () => navigate("/menu-gestione/convention") },
                  ]}
                  iconButton={<i className="bi bi-gear" />}
                />
              )}
            </div>

            <div className="col-auto p-0">
              <DropdownButton
                label="Mario Rossi"
                actions={[
                  {
                    label: "Logout",
                    onClick: () => console.log("Logout clicked"),
                  },
                ]}
                iconButton={<i className="bi bi-chevron-compact-down" />}
              />
            </div>
          </>
        )}
      </div>

      {/* Banda blu - IDENTICA all'altra app */}
      <div className="row blue-band align-items-center">
        <div className="col bold-text-28-white ms-5 ps-4">
          Assegnazione Dispositivi
        </div>
      </div>
    </header>
  );
};

export default Header;