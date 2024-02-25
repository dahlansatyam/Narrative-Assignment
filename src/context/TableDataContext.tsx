import React from "react";

export const TableContext = React.createContext<any>(null);
type Props = {
  children: React.ReactNode;
};

function TableDataContext({ children }: Props) {
  const [uploadData, setUploadData] = React.useState<any>();
  const [newHeaderSchema, setNewHeaderSchema] = React.useState<string[]>([]);

  return (
    <TableContext.Provider
      value={{ uploadData, setUploadData, newHeaderSchema, setNewHeaderSchema }}
    >
      {children}
    </TableContext.Provider>
  );
}

export default TableDataContext;
