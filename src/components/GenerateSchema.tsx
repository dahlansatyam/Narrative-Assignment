import { TrashIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { TableContext } from "../context/TableDataContext";
import classNames from "classnames";

type Props = {
  setNewHeaders: (val: any) => void;
  newHeaders: string[];
};

function GenerateSchema({ newHeaders, setNewHeaders }: Props) {
  const [headerName, setHeaderName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { uploadData, setNewHeaderSchema } = useContext(TableContext) as any;

  const handleHeader = () => {
    setError("");
    if (newHeaders?.includes(headerName)) {
      setError("Header Name already exist, Enter  a unique name.");
    } else {
      setNewHeaders([...newHeaders, headerName]);
      setHeaderName("");
    }
  };

  const onConfirmSchema = () => {
    setNewHeaderSchema(newHeaders);
  };

  return (
    <div className={classNames("space-y-6 my-12", { hidden: !uploadData })}>
      <p className="text-xl font-medium text-gray-100 bg-gray-900 px-4 py-2 rounded-lg">
        Create your own schema
      </p>
      <div className="bg-gray-100 max-w-sm rounded-md">
        {newHeaders?.map((item, index) => (
          <div className="flex items-center border-b p-4 last:border-none border-gray-300 justify-between space-x-4">
            <p key={index} className="text-gray-800 font-medium">
              <span>{index + 1}. </span>
              {item}
            </p>
            <TrashIcon
              onClick={() => {
                setNewHeaders(newHeaders?.filter((name) => name !== item));
              }}
              className="text-gray-600 hover:text-red-600 cursor-pointer w-5 h-5"
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-4 items-center mt-4">
        <div className="w-full">
          <input
            type="text"
            name="first-name"
            id="first-name"
            value={headerName}
            placeholder="Enter Header Name"
            onChange={(e) => {
              setHeaderName(e.target.value);
            }}
            className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="button"
          className="block w-40 ml-auto rounded-md bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          onClick={handleHeader}
        >
          Add
        </button>
      </div>
      {error ? <p className="text-red-700">{error}</p> : ""}
      <button
        type="submit"
        className="block w-fit ml-auto rounded-md bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        onClick={onConfirmSchema}
      >
        Confirm Schema
      </button>
    </div>
  );
}

export default GenerateSchema;
