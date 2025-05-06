import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TenantProvider } from "./auth/context/TenantContext";
import { AuthenticationProvider } from "./auth/context/AuthContext";
import SettingsProvider from "./auth/context/SettingsContext.tsx";
import { SubscriptionsProvider } from "./auth/context/SubscriptionsContext.tsx";
import { MessageProvider } from "./context/MessageContext.tsx";
import { ReportProvider } from "./context/ReportContext.tsx";
import { ClassifiedProvider } from "./context/ClassifiedContext.tsx";
import { UserRatingProvider } from "./context/UserRatingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TenantProvider applicationId="bfe0b402-241c-11f0-a81e-1a220d8ac2c9">
      <AuthenticationProvider>
        <SettingsProvider>
          <SubscriptionsProvider>
            <ClassifiedProvider>
              <MessageProvider>
                <ReportProvider>
                  <UserRatingProvider>
                    <App />
                  </UserRatingProvider>
                </ReportProvider>
              </MessageProvider>
            </ClassifiedProvider>
          </SubscriptionsProvider>
        </SettingsProvider>
      </AuthenticationProvider>
    </TenantProvider>
  </StrictMode>
);
