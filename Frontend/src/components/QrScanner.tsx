import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader';

  const startScanning = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {} // ignore scan failures (no QR in frame)
      );
      setScanning(true);
    } catch (err: any) {
      const msg = err?.message || 'Camera access denied or unavailable';
      setError(msg);
      onError?.(msg);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      scannerRef.current?.clear();
    } catch {
      // ignore cleanup errors
    }
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        id={containerId}
        className="rounded-xl overflow-hidden bg-muted min-h-[240px] flex items-center justify-center"
        style={!scanning ? { display: 'flex' } : {}}
      >
        {!scanning && !error && (
          <div className="text-center p-6">
            <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Tap below to start camera</p>
          </div>
        )}
        {error && (
          <div className="text-center p-6">
            <CameraOff className="w-10 h-10 text-destructive/50 mx-auto mb-3" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant={scanning ? 'destructive' : 'outline'}
        className="w-full"
        onClick={scanning ? stopScanning : startScanning}
      >
        {scanning ? (
          <><CameraOff className="w-4 h-4 mr-2" /> Stop Camera</>
        ) : (
          <><Camera className="w-4 h-4 mr-2" /> Start QR Scanner</>
        )}
      </Button>
    </div>
  );
}
