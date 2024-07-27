import { ReactNode, useState } from "react";
import { Outlet } from "@remix-run/react";
import Layout from "~/components/Layout";
import NestedNavigation from "~/components/NestedNavigation";
import SideDrawer from "~/components/SideDrawer.v3.enhanced";

const navigationItems = [
  // ... (same as before)
];
const DetailDrawerContent = ({ pushPage }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Detail View</h3>
    <p>This is the detail view content.</p>
    <button
      onClick={() => pushPage(<NestedDrawerContent />, "Nested View")}
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Open Nested View
    </button>
  </div>
);

// Example drawer content components
const MainDrawerContent = ({ pushPage }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Main Drawer Content</h3>
    <button
      onClick={() =>
        pushPage(<DetailDrawerContent pushPage={pushPage} />, "Detail View")
      }
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      View Details
    </button>
  </div>
);

const NestedDrawerContent = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Nested View</h3>
    <p>This is a nested view within the drawer.</p>
  </div>
);

export default function DashboardLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentDrawerContent, setCurrentDrawerContent] =
    useState<ReactNode>(null);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  // The pushPage function allows you to add new pages to the drawer, while the popPage function (triggered by the back button) allows you to go back to the previous page. The current page is determined by the last item in the pageStack array.

  const pushPage = (newContent, newTitle) => {
    setPageStack((prevStack) => [
      ...prevStack,
      { content: newContent, title: newTitle },
    ]);
    setCurrentDrawerContent(newContent);
    setIsDrawerOpen(true);
  };

  const popPage = () => {
    if (pageStack.length > 1) {
      setPageStack((prevStack) => prevStack.slice(0, -1));
      setCurrentDrawerContent(pageStack[pageStack.length - 2].content);
    } else {
      setIsDrawerOpen(false);
    }
  };

  const [pageStack, setPageStack] = useState([
    {
      content: <MainDrawerContent pushPage={pushPage} />,
      title: "Main Drawer",
    },
  ]);

  // const currentPage = pageStack[pageStack.length - 1];
  // useEffect(() => {
  //   if (isDrawerOpen) {
  //     setCurrentDrawerContent(pageStack[pageStack.length - 1].content);
  //   }
  // }, [isDrawerOpen, pageStack]);

  // useEffect(() => {

  //   currentDrawerContent =
  // }, []);

  return (
    <Layout>
      <div className="flex">
        <NestedNavigation items={navigationItems} />
        <div className="flex-grow p-6">
          <button
            onClick={openDrawer}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Drawer
          </button>
          <Outlet context={{ openDrawer }} />
        </div>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialContent={currentDrawerContent}
        title="Main Drawer"
      />
    </Layout>
  );
}
