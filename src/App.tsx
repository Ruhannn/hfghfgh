import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface ParsedLog {
  ip: string;
  date: string;
  method: string;
  endpoint: string;
  status: string;
  size: string;
  referer: string;
  userAgent: string;
}

interface LogEntry {
  _id: string;
  log: string;
  date: Date;
}

export default function App() {
  const [data, setData] = useState<LogEntry[]>([]);

  useEffect(() => {
    axios.get("https://g-woad-six.vercel.app/data").then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data.length) {
    return <div>Loading...</div>;
  }

  const parseLog = (log: string): ParsedLog => {
    const regex =
      /(?<ip>[\d.]+) - - \[(?<date>[^\]]+)\] "(?<method>[A-Z]+) (?<endpoint>[^\s]+) HTTP\/1\.1" (?<status>\d{3}) (?<size>\d+) "(?<referer>[^"]*)" "(?<userAgent>[^"]*)"/;
    const match = log.match(regex);
    if (match?.groups) {
      const { ip, date, method, endpoint, status, size, referer, userAgent } =
        match.groups;
      return {
        ip,
        date,
        method,
        endpoint,
        status,
        size,
        referer,
        userAgent,
      };
    }
    return {} as ParsedLog;
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-sans bg-[#1a1b26] relative overflow-hidden">
      <div className="grid grid-cols-4 gap-6 mt-6">
        {data.map((logEntry) => {
          const parsedLog = parseLog(logEntry.log);
          return (
            <div
              key={logEntry._id}
              className="max-w-xs bg-[#2d2e3f] p-6 rounded-lg shadow-lg text-white">
              <h2 className="mb-4 text-2xl font-semibold">Log Details</h2>
              <div className="mb-2">
                <strong>IP Address:</strong> {parsedLog.ip}
              </div>
              <div className="mb-2">
                <strong>Time:</strong> {format(logEntry.date, "hh:mm a")}
              </div>
              <div className="mb-2">
                <strong>date:</strong> {format(logEntry.date, "dd/MM/yyy")}
              </div>
              <div className="mb-2">
                <strong>Method:</strong> {parsedLog.method}
              </div>
              <div className="mb-2">
                <strong>Endpoint:</strong> {parsedLog.endpoint}
              </div>
              <div className="mb-2">
                <strong>Status:</strong> {parsedLog.status}
              </div>
              <div className="mb-2">
                <strong>Size:</strong> {parsedLog.size} bytes
              </div>
              <div className="mb-2">
                <strong>Referer:</strong> {parsedLog.referer}
              </div>
              <div className="mb-2">
                <strong>User Agent:</strong> {parsedLog.userAgent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
