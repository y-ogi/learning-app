import { useEffect, useState } from 'react';

export const DebugLogger = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // 元のconsole.logを保存
    const originalLog = console.log;
    const originalError = console.error;

    // console.logをオーバーライド
    console.log = (...args) => {
      originalLog(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-20), `[LOG] ${message}`]);
    };

    // console.errorをオーバーライド
    console.error = (...args) => {
      originalError(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-20), `[ERROR] ${message}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs p-2 max-h-48 overflow-y-auto font-mono">
      <div className="mb-1 text-yellow-400">Debug Console:</div>
      {logs.map((log, index) => (
        <div key={index} className="whitespace-pre-wrap break-all">
          {log}
        </div>
      ))}
    </div>
  );
};