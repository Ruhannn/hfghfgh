import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface LogData {
  method: string;
  status: number;
  url: string;
  execTime: string;
  ip: string;
  userAgent: string;
  time: string;
}

interface ApiResponse {
  _id: string;
  log: string;
}

const LogCard: React.FC<{ log: LogData }> = ({ log }) => (
  <div className="p-6 text-gray-300 bg-gray-900 shadow-lg rounded-xl">
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">Time:</span>
        <span>{format(log.time, "hh:mm a dd/MM/yyy")}</span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">Method:</span>
        <span className="font-bold text-blue-400 uppercase">{log.method}</span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">Status:</span>
        <span
          className={`font-bold ${
            log.status >= 200 && log.status < 300
              ? "text-green-400"
              : log.status >= 400
              ? "text-red-400"
              : "text-yellow-400"
          }`}>
          {log.status}
        </span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">URL:</span>
        <span className="truncate">{log.url}</span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">
          Exec Time:
        </span>
        <span>{log.execTime} ms</span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">IP:</span>
        <span>{log.ip}</span>
      </div>
      <div className="flex items-center">
        <span className="w-32 text-sm font-medium text-gray-500">
          User Agent:
        </span>
        <span className="truncate">{log.userAgent}</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ApiResponse[]>("https://g-woad-six.vercel.app/data")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a1b26] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((entry) => (
          <LogCard
            key={entry._id}
            log={JSON.parse(entry.log)}
          />
        ))}
      </div>
    </div>
  );
}
