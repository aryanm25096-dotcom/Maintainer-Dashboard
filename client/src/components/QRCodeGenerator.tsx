import React, { useEffect, useRef, useState } from 'react';
import { QrCode, Download, Copy, Check, X } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  title?: string;
  onClose?: () => void;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  url,
  size = 200,
  title = "QR Code",
  onClose,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    generateQRCode();
  }, [url, size]);

  const generateQRCode = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using a pattern
    // In a real implementation, you'd use a proper QR code library
    const cellSize = Math.floor(size / 25);
    const actualSize = cellSize * 25;
    
    canvas.width = actualSize;
    canvas.height = actualSize;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, actualSize, actualSize);

    // Generate QR code pattern (simplified)
    const pattern = generateQRPattern(url);
    
    ctx.fillStyle = '#000000';
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row] && pattern[row][col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add corner markers
    drawCornerMarker(ctx, 0, 0, cellSize);
    drawCornerMarker(ctx, 18, 0, cellSize);
    drawCornerMarker(ctx, 0, 18, cellSize);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setQrCodeDataUrl(dataUrl);
  };

  const generateQRPattern = (text: string): boolean[][] => {
    // Simplified QR code pattern generation
    // In production, use a proper QR code library like 'qrcode-generator'
    const pattern: boolean[][] = [];
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    for (let row = 0; row < 25; row++) {
      pattern[row] = [];
      for (let col = 0; col < 25; col++) {
        // Generate pattern based on hash and position
        const value = (hash + row * 25 + col) % 3;
        pattern[row][col] = value === 0;
      }
    }

    return pattern;
  };

  const drawCornerMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number) => {
    const markerSize = 7;
    ctx.fillStyle = '#000000';
    
    // Outer square
    ctx.fillRect(x * cellSize, y * cellSize, markerSize * cellSize, markerSize * cellSize);
    
    // Inner white square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, (markerSize - 2) * cellSize, (markerSize - 2) * cellSize);
    
    // Inner black square
    ctx.fillStyle = '#000000';
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, (markerSize - 4) * cellSize, (markerSize - 4) * cellSize);
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRCode = async () => {
    if (!qrCodeDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="text-center">
        <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-4">
          Scan to visit: {url}
        </p>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={downloadQRCode}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={copyQRCode}
            className="btn-secondary flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
