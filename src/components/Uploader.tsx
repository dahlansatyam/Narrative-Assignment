import { useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { TableContext } from "../context/TableDataContext";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

type TTableData = {
  [key: string]: string;
};

type Props = {
  setHeaders: any;
};

const Uploader = ({ setHeaders }: Props) => {
  const { setUploadData, setNewHeaderSchema } = useContext<any>(
    TableContext
  ) as any;
  const [data, setData] = useState<TTableData[]>([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e?.target?.files?.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  useEffect(() => {
    if (file) {
      Papa.parse<TTableData[]>(file, {
        complete: (result: any) => {
          // 'result.data' contains the parsed CSV data
          setHeaders(result?.meta?.fields);
          setData(result?.data);
          setUploadData(result.data);
        },
        header: true, // Assuming the first row contains headers
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numeric values to numbers
      });
    }
  }, [file]);

  return (
    <div className="my-20">
      <p className="text-xl mb-6 w-full font-medium text-gray-100 bg-gray-900 px-4 py-2 rounded-lg">
        Read CSV file in React
      </p>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        {!file ? (
          <div className="text-center">
            <DocumentTextIcon className="text-gray-600 w-12 h-12 mx-auto" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-0 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a CSV file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            {data.length > 0 && (
              <table className="min-w-full border border-collapse border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {Object.keys(data[0] || {}).map((header, index) => (
                      <th
                        key={index}
                        className="py-2 px-4 border-b border-r font-semibold text-sm"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: any, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      {Object.values(row).map((value: any, columnIndex) => (
                        <td
                          key={columnIndex}
                          className="py-2 px-4 border-b border-r text-sm text-center"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <div className="mt-10 flex space-x-4 items-center justify-between">
        {error ? <p className="text-red-600 font-medium">{error}</p> : <p></p>}
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => {
              setFile(null);
              setData([]);
              setError("");
              setUploadData(null);
              setNewHeaderSchema([]);
            }}
            disabled={!file}
            type="button"
            className="block w-40 ml-auto rounded-md bg-red-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
