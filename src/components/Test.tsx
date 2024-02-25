import { useState } from "react";
import Papa from "papaparse";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const Test = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    if (!file) return setError("Enter a valid file");

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
      });
      const parsedData = csv?.data;
      const rows = Object.keys(parsedData[0]);

      const columns = Object.values(parsedData[0]);
      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      console.log(res);
      setData(res);
    };
    reader.readAsText(file);
  };

  return (
    <div className="my-20">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Read CSV file in React
      </label>
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
          <div className="text-center">
            <DocumentTextIcon className="text-gray-600 w-12 h-12 mx-auto" />
            <div className="mt-4 text-sm leading-6 text-gray-600">
              <p className="text-green-600 font-medium">File Uploaded.</p>
              <p className="text-gray-600">Click on parse to refactor the file</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 flex space-x-4 items-center justify-between">
        {error ? <p className="text-red-600 font-medium">{error}</p> : <p></p>}
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => {
              setFile("");
              setData([]);
              setError("");
            }}
            type="button"
            className="block w-40 ml-auto rounded-md bg-red-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Remove
          </button>
          <button
            onClick={handleParse}
            type="submit"
            disabled={!!error}
            className="block w-40 ml-auto rounded-md bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            Parse
          </button>
        </div>
      </div>
      <div className="flex justify-center my-12">
        {!error &&
          data.map((e, i) => (
            <div key={i}>
              {e[0]}:{e[1]}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Test;
