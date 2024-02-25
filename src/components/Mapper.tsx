import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Select from "./common/Select";
import { TableContext } from "../context/TableDataContext";
import classNames from "classnames";

type Props = {
  sharedHeaders: string[] | null;
};
interface IOption {
  value: string;
  displayValue: string;
}
type RowProps = {
  item: string;
  options: IOption[] | undefined;
  mapperOptions: IOption[] | undefined;
  setMappings: React.Dispatch<React.SetStateAction<TMapping[] | undefined>>;
};

type TMapping = {
  item: string;
  mapsTo: string;
  mapType: string;
};

const createMappings = (headers: string[] | null) => {
  return headers?.map((item: string) => ({
    item,
    mapsTo: "",
    mapType: "",
  }));
};

function Mapper({ sharedHeaders }: Props) {
  const [mappings, setMappings] = useState<TMapping[] | undefined>([]);
  const { uploadData, newHeaderSchema } = useContext(TableContext) as any;
  const [dataMapped, setDataMapped] = useState<any[]>([]);

  useEffect(() => {
    setMappings(createMappings(sharedHeaders));
  }, [sharedHeaders]);

  const options = useMemo(
    () =>
      newHeaderSchema?.map((item: string) => ({
        value: item,
        displayValue: item,
      })),
    [newHeaderSchema]
  );
  const mapperOptions = useMemo(
    () => [
      {
        value: "single",
        displayValue: "Single",
      },
      {
        value: "multiple",
        displayValue: "Multiple",
      },
    ],
    []
  );
  const handleMapping = () => {
    const mappedData = uploadData.map((item: any) => {
      let mappedObj = {} as any;
      for (let k in item) {
        const foundMapping = mappings?.find(
          (value) => value.item.toLowerCase() === k.toLowerCase()
        );
        if (foundMapping && foundMapping.mapsTo && foundMapping.mapType) {
          if (foundMapping.mapType === "single") {
            if (mappedObj[foundMapping.mapsTo]) {
              mappedObj = {
                ...mappedObj,
                [foundMapping.mapsTo]:
                  mappedObj[foundMapping.mapsTo] + " " + item[k].toString(),
              };
            } else {
              mappedObj = {
                ...mappedObj,
                [foundMapping.mapsTo]: item[k].toString(),
              };
            }
          }
          if (foundMapping.mapType === "multiple") {
            if (mappedObj[foundMapping.mapsTo]) {
              mappedObj = {
                ...mappedObj,
                [foundMapping.mapsTo]: [
                  ...mappedObj[foundMapping.mapsTo],
                  item[k],
                ],
              };
            } else {
              mappedObj = {
                ...mappedObj,
                [foundMapping.mapsTo]: [item[k]],
              };
            }
          }
        }
      }
      return mappedObj;
    });
    let modifiedMappedArr = [] as any;
    mappedData.forEach((item: any[]) => {
      Object.keys(item).forEach((key: any) => {
        if (Array.isArray(item[key])) {
          item[key].forEach((value: any) => {
            const newObj = {} as any;
            newObj[key] = value;
            Object.keys(item).forEach((otherKey: any) => {
              if (otherKey !== key) {
                newObj[otherKey] = item[otherKey];
              }
            });
            modifiedMappedArr.push(newObj);
          });
        }
      });
    });
    setDataMapped(modifiedMappedArr);
  };

  if (newHeaderSchema?.length === 0) return null;
  return (
    <div className={classNames("py-12 space-y-6")}>
      <p className="text-xl font-medium text-gray-100 bg-gray-900 px-4 py-2 rounded-lg">
        Create mapping
      </p>
      <div>
        {sharedHeaders?.map((item: string) => (
          <MapperRow
            key={item}
            item={item}
            mapperOptions={mapperOptions}
            options={options}
            setMappings={setMappings}
          />
        ))}
      </div>
      <button
        onClick={handleMapping}
        type="button"
        className="block w-40 ml-auto rounded-md bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
      >
        Map Values
      </button>
      {dataMapped.length > 0 && (
        <table className="min-w-full border border-collapse border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(dataMapped[0] || {}).map((header, index) => (
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
            {dataMapped.map((row: any, rowIndex: number) => {
              return (
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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const MapperRow: React.FC<RowProps> = ({
  item,
  options,
  mapperOptions,
  setMappings,
}) => {
  const handleField = useCallback((e: React.ChangeEvent) => {
    setMappings((prev) => {
      return prev?.map((mapping) => {
        if (mapping.item === item) {
          const updatedMappedValue = mapping;
          updatedMappedValue.mapsTo = (e.target as HTMLSelectElement).value;
          return updatedMappedValue;
        }
        return mapping;
      });
    });
  }, []);
  const handleType = useCallback((e: React.ChangeEvent) => {
    setMappings((prev) => {
      return prev?.map((mapping) => {
        if (mapping.item === item) {
          const updatedMappedValue = mapping;
          updatedMappedValue.mapType = (e.target as HTMLSelectElement).value;
          return updatedMappedValue;
        }
        return mapping;
      });
    });
  }, []);
  return (
    <div className="p-2 grid grid-cols-3 gap-x-3">
      <div>{item}</div>
      <Select
        label={"Select a field"}
        options={options}
        handleChange={handleField}
      />
      <Select
        label={"Select a MapperType"}
        options={mapperOptions}
        handleChange={handleType}
      />
    </div>
  );
};

export default Mapper;
