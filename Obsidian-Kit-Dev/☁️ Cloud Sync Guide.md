---
title: "☁️ Cloud Sync Guide"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["integration", "cloud", "sync", "backup", "collaboration"]
---

# ☁️ Cloud Sync & Collaboration Guide

Complete guide for synchronizing Obsidian Kit vaults across devices and integrating with cloud services for backup and collaboration.

## 📋 Table of Contents

1. [Cloud Service Integration](#cloud-service-integration)
2. [Multi-Device Sync Setup](#multi-device-sync-setup)
3. [Backup Strategies](#backup-strategies)
4. [Collaboration Workflows](#collaboration-workflows)
5. [Conflict Resolution](#conflict-resolution)
6. [Security & Privacy](#security--privacy)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## 🌐 Cloud Service Integration

### 1. Obsidian Sync (Official)

**Setup Instructions**:
```bash
# Enable Obsidian Sync
1. Settings > Core Plugins > Enable "Sync"
2. Sign in with Obsidian account
3. Select vault to sync
4. Configure sync settings
```

**Configuration**:
```javascript
// .obsidian/sync.json
{
  "version": "1.0.0",
  "vault": {
    "name": "Obsidian-Kit-Dev",
    "id": "vault-uuid-here"
  },
  "sync": {
    "enabled": true,
    "auto_sync": true,
    "sync_interval": 300,
    "sync_on_startup": true,
    "sync_on_file_change": true
  },
  "excluded_files": [
    ".obsidian/cache/**",
    ".obsidian/workspace*",
    "*.tmp",
    "*.log"
  ],
  "included_files": [
    "4 - Projects/**",
    "3 - Templates/**",
    "agents/**",
    "mcp-config.json"
  ]
}
```

**Sync Status Monitoring**:
```javascript
// scripts/sync-monitor.js
class SyncMonitor {
  constructor() {
    this.lastSync = null
    this.syncStatus = 'idle'
    this.conflicts = []
  }
  
  async checkSyncStatus() {
    const status = await this.getSyncStatus()
    
    if (status.conflicts.length > 0) {
      await this.handleConflicts(status.conflicts)
    }
    
    if (status.needsSync) {
      await this.triggerSync()
    }
    
    return status
  }
  
  async handleConflicts(conflicts) {
    for (const conflict of conflicts) {
      const resolution = await this.resolveConflict(conflict)
      await this.applyResolution(resolution)
    }
  }
}
```

### 2. iCloud Integration

**macOS Setup**:
```bash
# Move vault to iCloud
mv ~/Obsidian/MyVault ~/Library/Mobile\ Documents/com~apple~CloudDocs/Obsidian/MyVault

# Create symbolic link
ln -s ~/Library/Mobile\ Documents/com~apple~CloudDocs/Obsidian/MyVault ~/Obsidian/MyVault
```

**Configuration Script**:
```bash
#!/bin/bash
# scripts/setup-icloud.sh

VAULT_NAME="Obsidian-Kit-Dev"
ICLOUD_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
OBISIDIAN_PATH="$HOME/Obsidian"

echo "Setting up iCloud sync for $VAULT_NAME..."

# Create iCloud directory if it doesn't exist
mkdir -p "$ICLOUD_PATH/Obsidian"

# Move vault to iCloud if not already there
if [ -d "$OBISIDIAN_PATH/$VAULT_NAME" ] && [ ! -L "$OBISIDIAN_PATH/$VAULT_NAME" ]; then
    echo "Moving vault to iCloud..."
    mv "$OBISIDIAN_PATH/$VAULT_NAME" "$ICLOUD_PATH/Obsidian/"
fi

# Create symbolic link
if [ ! -L "$OBISIDIAN_PATH/$VAULT_NAME" ]; then
    echo "Creating symbolic link..."
    ln -s "$ICLOUD_PATH/Obsidian/$VAULT_NAME" "$OBISIDIAN_PATH/$VAULT_NAME"
fi

echo "iCloud sync setup complete!"
```

### 3. Google Drive Integration

**Using Google Drive Desktop**:
```bash
# Setup Google Drive sync folder
GDRIVE_PATH="$HOME/Google Drive/My Drive"
VAULT_PATH="$GDRIVE_PATH/Obsidian/Obsidian-Kit-Dev"

# Create directory structure
mkdir -p "$GDRIVE_PATH/Obsidian"

# Move vault to Google Drive
if [ -d "$HOME/Obsidian/Obsidian-Kit-Dev" ]; then
    mv "$HOME/Obsidian/Obsidian-Kit-Dev" "$VAULT_PATH"
    ln -s "$VAULT_PATH" "$HOME/Obsidian/Obsidian-Kit-Dev"
fi
```

**Google Drive API Integration**:
```javascript
// lib/google-drive-sync.js
const { google } = require('googleapis')

class GoogleDriveSync {
  constructor(credentials) {
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })
    this.drive = google.drive({ version: 'v3', auth: this.auth })
  }
  
  async uploadFile(filePath, folderId) {
    const fileMetadata = {
      name: path.basename(filePath),
      parents: folderId ? [folderId] : []
    }
    
    const media = {
      mimeType: 'text/markdown',
      body: fs.createReadStream(filePath)
    }
    
    const response = await this.drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    })
    
    return response.data.id
  }
  
  async downloadFile(fileId, localPath) {
    const response = await this.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' })
    
    const writer = fs.createWriteStream(localPath)
    response.data.pipe(writer)
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
  
  async syncFolder(localFolder, driveFolderId) {
    const localFiles = await this.getLocalFiles(localFolder)
    const driveFiles = await this.getDriveFiles(driveFolderId)
    
    // Upload new/modified files
    for (const file of localFiles) {
      const driveFile = driveFiles.find(f => f.name === file.name)
      
      if (!driveFile || file.modified > driveFile.modified) {
        await this.uploadFile(file.path, driveFolderId)
      }
    }
    
    // Download new/modified files
    for (const file of driveFiles) {
      const localFile = localFiles.find(f => f.name === file.name)
      
      if (!localFile || file.modified > localFile.modified) {
        await this.downloadFile(file.id, path.join(localFolder, file.name))
      }
    }
  }
}
```

### 4. Dropbox Integration

**Dropbox Setup**:
```bash
# Dropbox API setup
DROPBOX_TOKEN="your-dropbox-access-token"
DROPBOX_APP_KEY="your-app-key"
DROPBOX_APP_SECRET="your-app-secret"
```

**Dropbox Sync Script**:
```javascript
// lib/dropbox-sync.js
const Dropbox = require('dropbox').Dropbox

class DropboxSync {
  constructor(accessToken) {
    this.dbx = new Dropbox({ accessToken })
  }
  
  async uploadFile(localPath, dropboxPath) {
    const contents = await fs.readFile(localPath)
    
    try {
      const response = await this.dbx.filesUpload({
        path: dropboxPath,
        contents: contents,
        mode: 'overwrite'
      })
      
      return response.result
    } catch (error) {
      if (error.status === 409) {
        // File conflict - handle appropriately
        return await this.handleConflict(localPath, dropboxPath)
      }
      throw error
    }
  }
  
  async downloadFile(dropboxPath, localPath) {
    const response = await this.dbx.filesDownload({ path: dropboxPath })
    await fs.writeFile(localPath, response.result.fileBinary)
    return response.result
  }
  
  async syncFolder(localFolder, dropboxFolder) {
    const localFiles = await this.scanLocalFolder(localFolder)
    const dropboxFiles = await this.scanDropboxFolder(dropboxFolder)
    
    // Sync logic here
    const syncOperations = this.calculateSyncOperations(localFiles, dropboxFiles)
    
    for (const operation of syncOperations) {
      await this.executeOperation(operation)
    }
  }
  
  calculateSyncOperations(localFiles, dropboxFiles) {
    const operations = []
    
    // Files to upload
    for (const localFile of localFiles) {
      const dropboxFile = dropboxFiles.find(f => f.name === localFile.name)
      
      if (!dropboxFile || localFile.modified > dropboxFile.modified) {
        operations.push({
          type: 'upload',
          local: localFile,
          remote: dropboxFile
        })
      }
    }
    
    // Files to download
    for (const dropboxFile of dropboxFiles) {
      const localFile = localFiles.find(f => f.name === dropboxFile.name)
      
      if (!localFile || dropboxFile.modified > localFile.modified) {
        operations.push({
          type: 'download',
          local: localFile,
          remote: dropboxFile
        })
      }
    }
    
    return operations
  }
}
```

---

## 📱 Multi-Device Sync Setup

### Device Configuration Management

```yaml
# config/devices.yaml
devices:
  desktop:
    name: "Desktop Computer"
    type: "desktop"
    os: "macos"
    sync_method: "obsidian-sync"
    priority: 1
    auto_sync: true
    sync_interval: 300
    
  laptop:
    name: "Work Laptop"
    type: "laptop"
    os: "windows"
    sync_method: "icloud"
    priority: 2
    auto_sync: true
    sync_interval: 600
    
  mobile:
    name: "iPhone"
    type: "mobile"
    os: "ios"
    sync_method: "obsidian-sync"
    priority: 3
    auto_sync: false
    sync_interval: 1800
    
  tablet:
    name: "iPad"
    type: "tablet"
    os: "ipados"
    sync_method: "icloud"
    priority: 4
    auto_sync: false
    sync_interval: 1800
```

### Device-Specific Configuration

```javascript
// lib/device-manager.js
class DeviceManager {
  constructor(configPath) {
    this.configPath = configPath
    this.devices = new Map()
    this.currentDevice = null
  }
  
  async loadConfig() {
    const config = await yaml.load(await fs.readFile(this.configPath, 'utf8'))
    
    for (const [id, device] of Object.entries(config.devices)) {
      this.devices.set(id, device)
    }
    
    this.currentDevice = await this.detectCurrentDevice()
  }
  
  async detectCurrentDevice() {
    const os = require('os')
    const platform = os.platform()
    const hostname = os.hostname()
    
    for (const [id, device] of this.devices) {
      if (this.matchesDevice(device, platform, hostname)) {
        return { id, ...device }
      }
    }
    
    // Return default device if no match
    return {
      id: 'unknown',
      name: 'Unknown Device',
      type: 'desktop',
      os: platform,
      sync_method: 'manual'
    }
  }
  
  matchesDevice(device, platform, hostname) {
    // Match by hostname or other identifiers
    return device.hostname === hostname || 
           (device.os === platform && device.auto_detect)
  }
  
  getDeviceConfig(deviceId) {
    return this.devices.get(deviceId)
  }
  
  async updateDeviceConfig(deviceId, updates) {
    const device = this.devices.get(deviceId)
    if (device) {
      Object.assign(device, updates)
      await this.saveConfig()
    }
  }
  
  async saveConfig() {
    const config = {
      devices: Object.fromEntries(this.devices)
    }
    
    await fs.writeFile(this.configPath, yaml.dump(config))
  }
}
```

### Cross-Platform Sync Script

```javascript
// scripts/cross-platform-sync.js
class CrossPlatformSync {
  constructor(deviceManager) {
    this.deviceManager = deviceManager
    this.syncStrategies = new Map()
    this.setupStrategies()
  }
  
  setupStrategies() {
    this.syncStrategies.set('obsidian-sync', new ObsidianSyncStrategy())
    this.syncStrategies.set('icloud', new iCloudSyncStrategy())
    this.syncStrategies.set('google-drive', new GoogleDriveSyncStrategy())
    this.syncStrategies.set('dropbox', new DropboxSyncStrategy())
    this.syncStrategies.set('git', new GitSyncStrategy())
  }
  
  async sync() {
    const device = this.deviceManager.currentDevice
    const strategy = this.syncStrategies.get(device.sync_method)
    
    if (!strategy) {
      throw new Error(`Unknown sync method: ${device.sync_method}`)
    }
    
    console.log(`Syncing using ${device.sync_method} strategy...`)
    
    try {
      const result = await strategy.sync(device)
      console.log('Sync completed:', result)
      return result
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    }
  }
  
  async scheduleSync() {
    const device = this.deviceManager.currentDevice
    
    if (!device.auto_sync) {
      console.log('Auto-sync disabled for this device')
      return
    }
    
    setInterval(async () => {
      try {
        await this.sync()
      } catch (error) {
        console.error('Scheduled sync failed:', error)
      }
    }, device.sync_interval * 1000)
  }
}

class GitSyncStrategy {
  async sync(device) {
    const { execSync } = require('child_process')
    
    try {
      // Add all changes
      execSync('git add .', { stdio: 'inherit' })
      
      // Commit with device identifier
      const message = `Sync from ${device.name} at ${new Date().toISOString()}`
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' })
      
      // Pull latest changes
      execSync('git pull origin main', { stdio: 'inherit' })
      
      // Push changes
      execSync('git push origin main', { stdio: 'inherit' })
      
      return { success: true, message: 'Git sync completed' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
```

---

## 💾 Backup Strategies

### Automated Backup System

```javascript
// lib/backup-system.js
class BackupSystem {
  constructor(config) {
    this.config = config
    this.providers = new Map()
    this.setupProviders()
  }
  
  setupProviders() {
    this.providers.set('local', new LocalBackupProvider())
    this.providers.set('google-drive', new GoogleDriveBackupProvider())
    this.providers.set('dropbox', new DropboxBackupProvider())
    this.providers.set('s3', new S3BackupProvider())
  }
  
  async createBackup(type = 'full') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupName = `obsidian-kit-backup-${timestamp}`
    
    console.log(`Creating ${type} backup: ${backupName}`)
    
    // Create backup archive
    const archivePath = await this.createArchive(backupName, type)
    
    // Upload to all configured providers
    const results = []
    for (const [name, provider] of this.providers) {
      if (this.config.providers[name]?.enabled) {
        try {
          const result = await provider.upload(archivePath, backupName)
          results.push({ provider: name, success: true, result })
        } catch (error) {
          results.push({ provider: name, success: false, error: error.message })
        }
      }
    }
    
    // Clean up local archive
    await fs.unlink(archivePath)
    
    return { backupName, results }
  }
  
  async createArchive(backupName, type) {
    const archiver = require('archiver')
    const path = require('path')
    
    const archivePath = path.join(this.config.temp_dir, `${backupName}.zip`)
    const output = fs.createWriteStream(archivePath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    
    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(archivePath))
      archive.on('error', reject)
      
      archive.pipe(output)
      
      if (type === 'full') {
        // Full backup
        archive.directory('4 - Projects/', 'projects')
        archive.directory('3 - Templates/', 'templates')
        archive.directory('agents/', 'agents')
        archive.file('mcp-config.json', { name: 'mcp-config.json' })
      } else if (type === 'incremental') {
        // Incremental backup (only recent changes)
        const recentFiles = await this.getRecentFiles()
        for (const file of recentFiles) {
          archive.file(file.path, { name: file.relativePath })
        }
      }
      
      archive.finalize()
    })
  }
  
  async restoreBackup(backupName, targetPath) {
    console.log(`Restoring backup: ${backupName}`)
    
    // Try each provider until successful
    for (const [name, provider] of this.providers) {
      try {
        const archivePath = await provider.download(backupName)
        await this.extractArchive(archivePath, targetPath)
        await fs.unlink(archivePath)
        return { success: true, provider: name }
      } catch (error) {
        console.log(`Failed to restore from ${name}:`, error.message)
      }
    }
    
    throw new Error('Failed to restore backup from any provider')
  }
  
  async scheduleBackups() {
    const schedule = require('node-schedule')
    
    // Daily backup at 2 AM
    schedule.scheduleJob('0 2 * * *', async () => {
      await this.createBackup('daily')
    })
    
    // Weekly full backup on Sunday at 3 AM
    schedule.scheduleJob('0 3 * * 0', async () => {
      await this.createBackup('full')
    })
    
    // Monthly backup on 1st at 4 AM
    schedule.scheduleJob('0 4 1 * *', async () => {
      await this.createBackup('monthly')
    })
  }
}
```

### Backup Configuration

```yaml
# config/backup.yaml
backup:
  temp_dir: "/tmp/obsidian-kit-backups"
  retention:
    daily: 7
    weekly: 4
    monthly: 12
    
  providers:
    local:
      enabled: true
      path: "~/backups/obsidian-kit"
      
    google-drive:
      enabled: true
      folder_id: "your-google-drive-folder-id"
      credentials_file: "config/google-drive-credentials.json"
      
    dropbox:
      enabled: true
      access_token: "your-dropbox-access-token"
      folder: "/Apps/Obsidian Kit/Backups"
      
    s3:
      enabled: false
      bucket: "obsidian-kit-backups"
      region: "us-east-1"
      access_key_id: "your-access-key"
      secret_access_key: "your-secret-key"
      
  exclude_patterns:
    - ".obsidian/cache/**"
    - ".obsidian/workspace*"
    - "*.tmp"
    - "*.log"
    - "node_modules/**"
    
  include_patterns:
    - "4 - Projects/**"
    - "3 - Templates/**"
    - "agents/**"
    - "*.md"
    - "*.json"
    - "*.yaml"
```

---

## 👥 Collaboration Workflows

### Multi-User Collaboration

```javascript
// lib/collaboration.js
class CollaborationManager {
  constructor(config) {
    this.config = config
    this.users = new Map()
    this.locks = new Map()
    this.conflicts = new Map()
  }
  
  async acquireLock(filePath, userId, timeout = 300000) {
    const lock = {
      userId,
      acquiredAt: Date.now(),
      timeout,
      filePath
    }
    
    // Check if file is already locked
    if (this.locks.has(filePath)) {
      const existingLock = this.locks.get(filePath)
      
      // Check if lock has expired
      if (Date.now() - existingLock.acquiredAt < existingLock.timeout) {
        throw new Error(`File locked by ${existingLock.userId}`)
      } else {
        // Remove expired lock
        this.locks.delete(filePath)
      }
    }
    
    this.locks.set(filePath, lock)
    
    // Auto-release lock after timeout
    setTimeout(() => {
      this.releaseLock(filePath, userId)
    }, timeout)
    
    return lock
  }
  
  async releaseLock(filePath, userId) {
    const lock = this.locks.get(filePath)
    
    if (lock && lock.userId === userId) {
      this.locks.delete(filePath)
      return true
    }
    
    return false
  }
  
  async checkConflict(filePath, content, userId) {
    const existingContent = await this.getFileContent(filePath)
    
    if (existingContent && existingContent !== content) {
      const conflict = {
        filePath,
        userId,
        timestamp: Date.now(),
        localContent: existingContent,
        remoteContent: content,
        resolved: false
      }
      
      this.conflicts.set(filePath, conflict)
      return conflict
    }
    
    return null
  }
  
  async resolveConflict(filePath, resolution, userId) {
    const conflict = this.conflicts.get(filePath)
    
    if (!conflict) {
      throw new Error('No conflict found for file')
    }
    
    if (conflict.userId !== userId) {
      throw new Error('Only conflict owner can resolve')
    }
    
    // Apply resolution
    switch (resolution.type) {
      case 'use_local':
        await this.writeFile(filePath, conflict.localContent)
        break
      case 'use_remote':
        await this.writeFile(filePath, conflict.remoteContent)
        break
      case 'merge':
        const merged = await this.mergeContent(
          conflict.localContent,
          conflict.remoteContent,
          resolution.mergeStrategy
        )
        await this.writeFile(filePath, merged)
        break
      default:
        throw new Error(`Unknown resolution type: ${resolution.type}`)
    }
    
    conflict.resolved = true
    conflict.resolvedAt = Date.now()
    conflict.resolvedBy = userId
    
    this.conflicts.delete(filePath)
    return conflict
  }
  
  async mergeContent(local, remote, strategy = 'auto') {
    const { diff3Merge } = require('node-diff3')
    
    if (strategy === 'auto') {
      const result = diff3Merge(local, [], remote)
      
      if (result.conflict) {
        throw new Error('Auto-merge failed, manual resolution required')
      }
      
      return result.result.join('\n')
    }
    
    // Manual merge strategies can be implemented here
    throw new Error(`Merge strategy not implemented: ${strategy}`)
  }
}
```

### Real-time Collaboration

```javascript
// lib/realtime-collab.js
const WebSocket = require('ws')
const chokidar = require('chokidar')

class RealtimeCollaboration {
  constructor(port = 8080) {
    this.port = port
    this.wss = null
    this.clients = new Map()
    this.fileWatchers = new Map()
  }
  
  start() {
    this.wss = new WebSocket.Server({ port: this.port })
    
    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request)
    })
    
    console.log(`Real-time collaboration server started on port ${this.port}`)
  }
  
  handleConnection(ws, request) {
    const clientId = this.generateClientId()
    const client = {
      id: clientId,
      ws,
      address: request.socket.remoteAddress,
      connectedAt: Date.now(),
      subscriptions: new Set()
    }
    
    this.clients.set(clientId, client)
    
    ws.on('message', (message) => {
      this.handleMessage(clientId, message)
    })
    
    ws.on('close', () => {
      this.handleDisconnection(clientId)
    })
    
    // Send welcome message
    this.sendToClient(clientId, {
      type: 'welcome',
      clientId: clientId
    })
  }
  
  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message)
      
      switch (data.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, data.filePath)
          break
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, data.filePath)
          break
        case 'edit':
          this.handleEdit(clientId, data)
          break
        case 'cursor':
          this.handleCursor(clientId, data)
          break
        default:
          console.log(`Unknown message type: ${data.type}`)
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  }
  
  handleSubscribe(clientId, filePath) {
    const client = this.clients.get(clientId)
    if (!client) return
    
    client.subscriptions.add(filePath)
    
    // Start watching file if not already watching
    if (!this.fileWatchers.has(filePath)) {
      this.startFileWatcher(filePath)
    }
    
    // Notify other clients
    this.broadcast({
      type: 'user_subscribed',
      filePath: filePath,
      userId: clientId
    }, clientId)
  }
  
  handleEdit(clientId, data) {
    const { filePath, operation, content } = data
    
    // Apply edit operation
    this.applyEditOperation(filePath, operation)
    
    // Broadcast to other subscribed clients
    this.broadcast({
      type: 'edit',
      filePath: filePath,
      operation: operation,
      userId: clientId
    }, clientId)
  }
  
  startFileWatcher(filePath) {
    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: true
    })
    
    watcher.on('change', () => {
      this.broadcastFileChange(filePath)
    })
    
    this.fileWatchers.set(filePath, watcher)
  }
  
  broadcastFileChange(filePath) {
    this.broadcast({
      type: 'file_changed',
      filePath: filePath,
      timestamp: Date.now()
    })
  }
  
  broadcast(message, excludeClientId = null) {
    const messageStr = JSON.stringify(message)
    
    for (const [clientId, client] of this.clients) {
      if (clientId !== excludeClientId && client.subscriptions.has(message.filePath)) {
        client.ws.send(messageStr)
      }
    }
  }
  
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId)
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message))
    }
  }
  
  generateClientId() {
    return Math.random().toString(36).substr(2, 9)
  }
}
```

---

## ⚔️ Conflict Resolution

### Conflict Detection Algorithm

```javascript
// lib/conflict-detector.js
class ConflictDetector {
  constructor() {
    this.fileStates = new Map()
  }
  
  async detectConflicts(localPath, remoteContent) {
    const localState = this.fileStates.get(localPath)
    const localContent = await fs.readFile(localPath, 'utf8')
    
    if (!localState) {
      // First time seeing this file
      this.fileStates.set(localPath, {
        content: localContent,
        hash: this.hashContent(localContent),
        lastModified: Date.now()
      })
      return null
    }
    
    const localHash = this.hashContent(localContent)
    const remoteHash = this.hashContent(remoteContent)
    
    // Check if there are conflicts
    if (localHash !== localState.hash && remoteHash !== localState.hash) {
      // Both local and remote have changed
      return {
        type: 'both_modified',
        filePath: localPath,
        localContent,
        remoteContent,
        baseContent: localState.content,
        localHash,
        remoteHash,
        baseHash: localState.hash
      }
    } else if (localHash !== localState.hash) {
      // Only local has changed
      return {
        type: 'local_modified',
        filePath: localPath,
        localContent,
        remoteContent
      }
    } else if (remoteHash !== localState.hash) {
      // Only remote has changed
      return {
        type: 'remote_modified',
        filePath: localPath,
        localContent,
        remoteContent
      }
    }
    
    // No conflicts
    return null
  }
  
  hashContent(content) {
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(content).digest('hex')
  }
  
  async resolveConflict(conflict, strategy = 'auto') {
    switch (strategy) {
      case 'auto':
        return await this.autoResolve(conflict)
      case 'manual':
        return await this.manualResolve(conflict)
      case 'local_wins':
        return conflict.localContent
      case 'remote_wins':
        return conflict.remoteContent
      default:
        throw new Error(`Unknown resolution strategy: ${strategy}`)
    }
  }
  
  async autoResolve(conflict) {
    const { diff3Merge } = require('node-diff3')
    
    const result = diff3Merge(
      conflict.localContent.split('\n'),
      conflict.baseContent.split('\n'),
      conflict.remoteContent.split('\n')
    )
    
    if (result.conflict) {
      throw new Error('Auto-resolution failed, manual intervention required')
    }
    
    return result.result.join('\n')
  }
  
  async manualResolve(conflict) {
    // Create conflict file for manual resolution
    const conflictPath = conflict.filePath + '.conflict'
    const conflictContent = this.createConflictFile(conflict)
    
    await fs.writeFile(conflictPath, conflictContent)
    
    // Wait for user to resolve
    console.log(`Conflict detected in ${conflict.filePath}`)
    console.log(`Please resolve conflicts in ${conflictPath}`)
    
    // Poll for resolution
    return await this.waitForResolution(conflictPath)
  }
  
  createConflictFile(conflict) {
    return `<<<<<<< LOCAL
${conflict.localContent}
=======
${conflict.remoteContent}
>>>>>>> REMOTE
`
  }
  
  async waitForResolution(conflictPath) {
    const maxWait = 3600000 // 1 hour
    const checkInterval = 5000 // 5 seconds
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWait) {
      try {
        const content = await fs.readFile(conflictPath, 'utf8')
        
        if (!content.includes('<<<<<<< LOCAL')) {
          // Conflict resolved
          await fs.unlink(conflictPath)
          return content
        }
      } catch (error) {
        // File might not exist yet
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval))
    }
    
    throw new Error('Conflict resolution timeout')
  }
}
```

---

## 🔒 Security & Privacy

### End-to-End Encryption

```javascript
// lib/encryption.js
const crypto = require('crypto')

class EncryptionManager {
  constructor(key) {
    this.algorithm = 'aes-256-gcm'
    this.key = Buffer.from(key, 'hex')
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    }
  }
  
  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    )
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
  
  async encryptFile(filePath, outputPath) {
    const content = await fs.readFile(filePath, 'utf8')
    const encrypted = this.encrypt(content)
    
    await fs.writeFile(outputPath, JSON.stringify(encrypted))
    return encrypted
  }
  
  async decryptFile(encryptedPath, outputPath) {
    const encryptedData = JSON.parse(await fs.readFile(encryptedPath, 'utf8'))
    const decrypted = this.decrypt(encryptedData)
    
    await fs.writeFile(outputPath, decrypted)
    return decrypted
  }
}
```

### Access Control

```javascript
// lib/access-control.js
class AccessControl {
  constructor(config) {
    this.config = config
    this.permissions = new Map()
    this.sessions = new Map()
  }
  
  async authenticate(username, password) {
    const user = this.config.users[username]
    
    if (!user) {
      throw new Error('User not found')
    }
    
    const isValid = await this.verifyPassword(password, user.passwordHash)
    
    if (!isValid) {
      throw new Error('Invalid password')
    }
    
    const session = this.createSession(username)
    this.sessions.set(session.id, session)
    
    return session
  }
  
  async authorize(sessionId, resource, action) {
    const session = this.sessions.get(sessionId)
    
    if (!session || session.expiresAt < Date.now()) {
      throw new Error('Invalid or expired session')
    }
    
    const user = this.config.users[session.username]
    const permissions = user.permissions || []
    
    // Check permission
    const hasPermission = permissions.some(permission => {
      return this.matchesPermission(permission, resource, action)
    })
    
    if (!hasPermission) {
      throw new Error('Access denied')
    }
    
    return true
  }
  
  matchesPermission(permission, resource, action) {
    const [permResource, permAction] = permission.split(':')
    
    // Wildcard matching
    if (permResource === '*' && permAction === '*') {
      return true
    }
    
    if (permResource === '*' && permAction === action) {
      return true
    }
    
    if (permResource === resource && permAction === '*') {
      return true
    }
    
    // Exact matching
    return permResource === resource && permAction === action
  }
  
  createSession(username) {
    return {
      id: this.generateSessionId(),
      username: username,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }
  }
  
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex')
  }
  
  async verifyPassword(password, hash) {
    const bcrypt = require('bcrypt')
    return await bcrypt.compare(password, hash)
  }
}
```

---

## ⚡ Performance Optimization

### Sync Optimization

```javascript
// lib/sync-optimizer.js
class SyncOptimizer {
  constructor(config) {
    this.config = config
    this.fileCache = new Map()
    this.syncQueue = []
    this.batchSize = 10
    this.batchTimeout = 5000
  }
  
  async optimizeSync(files) {
    // Group files by type and priority
    const grouped = this.groupFiles(files)
    
    // Process high-priority files first
    const results = []
    
    for (const group of grouped) {
      const batchResults = await this.processBatch(group)
      results.push(...batchResults)
    }
    
    return results
  }
  
  groupFiles(files) {
    const groups = {
      high: [],
      medium: [],
      low: []
    }
    
    for (const file of files) {
      const priority = this.getFilePriority(file)
      groups[priority].push(file)
    }
    
    return [groups.high, groups.medium, groups.low]
  }
  
  getFilePriority(file) {
    // High priority: active tasks, recent changes
    if (file.path.includes('4 - Projects/') && 
        file.path.includes('.md') &&
        this.isRecentlyModified(file)) {
      return 'high'
    }
    
    // Medium priority: templates, configurations
    if (file.path.includes('3 - Templates/') ||
        file.path.includes('config/') ||
        file.name.endsWith('.json')) {
      return 'medium'
    }
    
    // Low priority: archives, old files
    return 'low'
  }
  
  async processBatch(files) {
    const batches = this.createBatches(files)
    const results = []
    
    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(file => this.processFile(file))
      )
      
      results.push(...batchResults)
    }
    
    return results
  }
  
  createBatches(files) {
    const batches = []
    
    for (let i = 0; i < files.length; i += this.batchSize) {
      batches.push(files.slice(i, i + this.batchSize))
    }
    
    return batches
  }
  
  async processFile(file) {
    // Check cache first
    const cacheKey = this.getCacheKey(file)
    const cached = this.fileCache.get(cacheKey)
    
    if (cached && cached.hash === file.hash) {
      return { file, status: 'cached', unchanged: true }
    }
    
    // Process file
    const result = await this.syncFile(file)
    
    // Update cache
    this.fileCache.set(cacheKey, {
      hash: file.hash,
      result: result,
      timestamp: Date.now()
    })
    
    return { file, status: 'synced', result }
  }
  
  getCacheKey(file) {
    return `${file.path}:${file.size}:${file.modified}`
  }
  
  isRecentlyModified(file) {
    const age = Date.now() - file.modified
    return age < (24 * 60 * 60 * 1000) // Less than 24 hours
  }
}
```

---

## 🛠️ Troubleshooting

### Common Sync Issues

#### 1. Merge Conflicts
```bash
# Reset to last known good state
git checkout HEAD~1 -- .

# Or use Obsidian Kit's conflict resolution
obsidian-kit resolve-conflicts --strategy auto
```

#### 2. Sync Timeouts
```javascript
// Increase timeout settings
const syncConfig = {
  timeout: 60000, // 60 seconds
  retryAttempts: 3,
  retryDelay: 5000 // 5 seconds
}
```

#### 3. Large File Sync Issues
```bash
# Exclude large files from sync
echo "*.large" >> .obsidian/sync-exclude.txt
echo "node_modules/**" >> .obsidian/sync-exclude.txt
```

### Debug Tools

```javascript
// scripts/sync-debug.js
class SyncDebugger {
  async diagnoseSyncIssues() {
    const issues = []
    
    // Check file permissions
    const permissionIssues = await this.checkPermissions()
    issues.push(...permissionIssues)
    
    // Check disk space
    const spaceIssues = await this.checkDiskSpace()
    issues.push(...spaceIssues)
    
    // Check network connectivity
    const networkIssues = await this.checkNetwork()
    issues.push(...networkIssues)
    
    // Check file integrity
    const integrityIssues = await this.checkFileIntegrity()
    issues.push(...integrityIssues)
    
    return issues
  }
  
  async checkPermissions() {
    const issues = []
    const files = await this.getAllFiles()
    
    for (const file of files) {
      try {
        await fs.access(file, fs.constants.R_OK | fs.constants.W_OK)
      } catch (error) {
        issues.push({
          type: 'permission',
          file: file,
          error: error.message
        })
      }
    }
    
    return issues
  }
  
  async checkDiskSpace() {
    const stats = await fs.statfs('.')
    const freeSpace = stats.bavail * stats.bsize
    const requiredSpace = await this.estimateRequiredSpace()
    
    if (freeSpace < requiredSpace) {
      return [{
        type: 'disk_space',
        free: freeSpace,
        required: requiredSpace,
        message: 'Insufficient disk space for sync'
      }]
    }
    
    return []
  }
  
  async checkNetwork() {
    const issues = []
    
    try {
      // Test connectivity to sync servers
      await this.testConnectivity('api.obsidian.md')
      await this.testConnectivity('github.com')
    } catch (error) {
      issues.push({
        type: 'network',
        error: error.message
      })
    }
    
    return issues
  }
  
  async testConnectivity(host) {
    const { promisify } = require('util')
    const { exec } = require('child_process')
    const execAsync = promisify(exec)
    
    await execAsync(`ping -c 1 ${host}`)
  }
}
```

### Recovery Procedures

```bash
#!/bin/bash
# scripts/emergency-recovery.sh

echo "Starting emergency recovery..."

# Create backup of current state
BACKUP_DIR="emergency-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp -r . "$BACKUP_DIR/"

# Reset to last known good state
if [ -d ".git" ]; then
    echo "Resetting to last good commit..."
    git reset --hard HEAD~1
fi

# Clear corrupted caches
rm -rf .obsidian/cache/*
rm -rf .obsidian/workspace*

# Restart sync services
echo "Restarting sync services..."
obsidian-kit sync --force

echo "Emergency recovery completed. Backup saved to: $BACKUP_DIR"
```

---

## 📚 Additional Resources

### Documentation
- [Obsidian Sync Documentation](https://help.obsidian.md/Obsidian+Sync)
- [iCloud Sync Guide](https://support.apple.com/guide/icloud/icloud-ff497efc)
- [Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [Dropbox API](https://www.dropbox.com/developers/documentation)

### Tools
- [rclone](https://rclone.org/) - Universal cloud sync tool
- [Syncthing](https://syncthing.net/) - Decentralized file sync
- [Git LFS](https://git-lfs.github.com/) - Large file storage for Git

### Best Practices
- Regular backups to multiple locations
- Test restore procedures periodically
- Monitor sync status and logs
- Use version control for critical files
- Implement proper access controls