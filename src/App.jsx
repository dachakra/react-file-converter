import React, { useState, useRef } from 'react'
import * as Sentry from '@sentry/react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionResult, setConversionResult] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setConversionResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFileSelect(file)
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    // Start Sentry span for the entire file conversion process
    await Sentry.startSpan(
      {
        name: 'file_conversion',
        op: 'file.convert',
        attributes: {
          'file.name': selectedFile.name,
          'file.size': selectedFile.size,
          'file.type': selectedFile.type || 'unknown'
        }
      },
      async () => {
        setIsConverting(true)
        setConversionResult(null)

        try {
          // Simulate HTTP API call to backend conversion service
          const formData = new FormData()
          formData.append('file', selectedFile)
          
          const response = await fetch('https://api.fileconverter.demo/convert', {
            method: 'POST',
            body: formData,
            headers: {
              'X-Conversion-Type': 'auto-detect',
            }
          })

          // This will fail since the URL doesn't exist, but Sentry will capture the HTTP span
          const result = await response.json()
          
          // Set result from API response (won't reach here due to demo URL)
          setConversionResult({
            success: true,
            message: result.message || `${selectedFile.name} was successfully converted!`,
            originalSize: selectedFile.size,
            convertedSize: result.convertedSize || Math.floor(selectedFile.size * 0.8)
          })
        } catch (error) {
          // Demo: Always show success regardless of API failure
          const convertedSize = Math.floor(selectedFile.size * 0.8)
          setConversionResult({
            success: true,
            message: `${selectedFile.name} was successfully converted!`,
            originalSize: selectedFile.size,
            convertedSize
          })
        } finally {
          setIsConverting(false)
        }
      }
    )
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const resetForm = () => {
    setSelectedFile(null)
    setConversionResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>File Converter Pro</h1>
          <p>Convert your files quickly and efficiently</p>
        </header>

        <div className="converter-card">
          {!selectedFile ? (
            <div
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📁</div>
              <h3>Drop your file here or click to browse</h3>
              <p>Supports all file types</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="file-info">
              <div className="file-details">
                <div className="file-icon">📄</div>
                <div className="file-meta">
                  <h3>{selectedFile.name}</h3>
                  <p>Size: {formatFileSize(selectedFile.size)}</p>
                  <p>Type: {selectedFile.type || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="actions">
                <button 
                  className="convert-btn"
                  onClick={handleConvert}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <span className="spinner"></span>
                      Converting...
                    </>
                  ) : (
                    'Convert File'
                  )}
                </button>
                
                <button 
                  className="reset-btn"
                  onClick={resetForm}
                  disabled={isConverting}
                >
                  Choose Different File
                </button>
              </div>
            </div>
          )}

          {conversionResult && (
            <div className={`result ${conversionResult.success ? 'success' : 'error'}`}>
              <div className="result-icon">
                {conversionResult.success ? '✅' : '❌'}
              </div>
              <div className="result-content">
                <h4>{conversionResult.success ? 'Conversion Successful!' : 'Conversion Failed'}</h4>
                <p>{conversionResult.message}</p>
                {conversionResult.success && (
                  <div className="result-stats">
                    <p>Original size: {formatFileSize(conversionResult.originalSize)}</p>
                    <p>Converted size: {formatFileSize(conversionResult.convertedSize)}</p>
                    <p>Compression: {Math.round((1 - conversionResult.convertedSize / conversionResult.originalSize) * 100)}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App