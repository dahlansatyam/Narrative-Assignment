import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Section from "./components/common/Section";
import Uploader from "./components/Uploader";
import Mapper from "./components/Mapper";
import TableDataContext from "./context/TableDataContext";
import GenerateSchema from "./components/GenerateSchema";

function App() {
  const [sharedHeaders, setSharedHeaders] = useState<string[]>([]);

  return (
    <>
      <Navbar />
      <TableDataContext>
        <Section>
          <Uploader setHeaders={setSharedHeaders} />
          <GenerateSchema />
          <Mapper sharedHeaders={sharedHeaders} />
        </Section>
      </TableDataContext>
    </>
  );
}

export default App;
