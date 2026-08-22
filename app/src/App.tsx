import { Spinner, tokens } from "@fluentui/react-components";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import DialogProvider from "./providers/DialogProvider";
import RuntimeInfoProvider from "./providers/RuntimeInfoProvider";
import ThemeProvider from "./providers/ThemeProvider";

const ShortenerView = lazy(() => import("./shortener/ShortenerView"));
const FilesView = lazy(() => import("./files/FilesView"));

const App: React.FC = (): React.ReactElement => (
	<BrowserRouter basename={new URL(document.baseURI).pathname}>
		<ThemeProvider>
			<RuntimeInfoProvider>
				{({ isAuthenticated }) => (
					<DialogProvider>
						{!isAuthenticated ?
							<LoginPage />
							:
							<MainPage>
								<Suspense
									fallback={
										<Spinner size="large" style={{ padding: tokens.spacingVerticalXXL }} />
									}
								>
									<Routes>
										<Route index element={<Navigate to="/shortener" />} />
										<Route path="/shortener" element={<ShortenerView />} />
										<Route path="/files" element={<FilesView />} />
										<Route path="*" element={<Navigate to="/shortener" />} />
									</Routes>
								</Suspense>
							</MainPage>
						}
					</DialogProvider>
				)}
			</RuntimeInfoProvider>
		</ThemeProvider>
	</BrowserRouter>
);

export default App;
