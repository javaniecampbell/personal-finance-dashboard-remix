import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles/tailwind.css";
import { MetaFunction } from "@remix-run/node";
import { ReplayProvider } from "~/components/ReplaySystem";
import { NotificationProvider } from "~/components/ErrorNotification";
import ErrorBoundary from "~/components/ErrorBoundary";
export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1",
  },
  { title: "Finance Dashboard" },
];

// export function links() {
//   return [{ rel: "stylesheet", href: styles }];
// }

export function Layout({ children }: { children: Readonly<React.ReactNode> }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ReplayProvider>
          <Outlet />
        </ReplayProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
