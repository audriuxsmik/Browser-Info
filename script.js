document.addEventListener('DOMContentLoaded', () => {
    function updateTime() {
      const now = new Date();
      const timeElement = document.getElementById('current-time');
      timeElement.textContent = now.toLocaleTimeString();
    }
    
    setInterval(updateTime, 1000);
    updateTime();
    
    document.getElementById('user-agent').textContent = navigator.userAgent;
    document.getElementById('platform').textContent = navigator.platform;
    document.getElementById('vendor').textContent = navigator.vendor || 'Not available';
    document.getElementById('cookies-enabled').textContent = navigator.cookieEnabled ? 'Yes' : 'No';
    
    function updateWindowSize() {
      document.getElementById('window-size').textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
      document.getElementById('screen-resolution').textContent = `${screen.width}px × ${screen.height}px`;
    }
    
    window.addEventListener('resize', updateWindowSize);
    updateWindowSize();
    
    document.getElementById('color-depth').textContent = `${screen.colorDepth} bits`;
    document.getElementById('pixel-ratio').textContent = window.devicePixelRatio;
    
    document.getElementById('language').textContent = navigator.language;
    document.getElementById('timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('do-not-track').textContent = navigator.doNotTrack || 'Not specified';
    
    function updateOnlineStatus() {
      const status = navigator.onLine ? 'Online' : 'Offline';
      const statusElement = document.getElementById('online-status');
      statusElement.textContent = status;
      statusElement.style.color = navigator.onLine ? 'var(--success)' : 'var(--danger)';
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    
    document.getElementById('touch-support').textContent = 'ontouchstart' in window ? 'Yes' : 'No';
    
    function checkWebGLSupport() {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl instanceof WebGLRenderingContext;
    }
    
    document.getElementById('webgl-support').textContent = checkWebGLSupport() ? 'Yes' : 'No';
    document.getElementById('canvas-support').textContent = !!document.createElement('canvas').getContext ? 'Yes' : 'No';
    
    function checkLocalStorage() {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    }
    
    document.getElementById('local-storage').textContent = checkLocalStorage() ? 'Available' : 'Not available';
    
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 * index);
    });
    
    function addDetailedInfo() {
      const section = document.createElement('section');
      section.className = 'info-card';
      section.innerHTML = `
        <h2>Performance & Memory</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Memory Usage</div>
            <div class="info-value" id="memory-usage">Calculating...</div>
          </div>
          <div class="info-item">
            <div class="info-label">CPU Cores</div>
            <div class="info-value" id="cpu-cores">Calculating...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Battery Status</div>
            <div class="info-value" id="battery-status">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Network Type</div>
            <div class="info-value" id="network-type">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(section);
      
      if (navigator.hardwareConcurrency) {
        document.getElementById('cpu-cores').textContent = navigator.hardwareConcurrency;
      } else {
        document.getElementById('cpu-cores').textContent = 'Not available';
      }
      
      if (performance && performance.memory) {
        const memoryInfo = performance.memory;
        const totalMemoryGB = (memoryInfo.jsHeapSizeLimit / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemoryGB = (memoryInfo.usedJSHeapSize / (1024 * 1024 * 1024)).toFixed(2);
        document.getElementById('memory-usage').textContent = `${usedMemoryGB}GB / ${totalMemoryGB}GB`;
      } else {
        document.getElementById('memory-usage').textContent = 'Not available';
      }
      
      if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
          function updateBatteryStatus() {
            const level = Math.floor(battery.level * 100);
            const charging = battery.charging ? 'Charging' : 'Not charging';
            document.getElementById('battery-status').textContent = `${level}% (${charging})`;
          }
          
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('chargingchange', updateBatteryStatus);
          updateBatteryStatus();
        }).catch(() => {
          document.getElementById('battery-status').textContent = 'Not available';
        });
      } else {
        document.getElementById('battery-status').textContent = 'Not available';
      }
      
      const networkSection = document.createElement('section');
      networkSection.className = 'info-card';
      networkSection.innerHTML = `
        <h2>Network Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Connection Type</div>
            <div class="info-value" id="connection-type">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Download Speed</div>
            <div class="info-value" id="download-speed">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">IP Address</div>
            <div class="info-value ip-container">
              <span id="ip-address">●●●●●●●●</span>
              <button id="toggle-ip" class="toggle-button">Show IP</button>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Network Status</div>
            <div class="info-value" id="network-status">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(networkSection);
      
      let ipAddress = '';
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          ipAddress = data.ip;
          const toggleButton = document.getElementById('toggle-ip');
          const ipDisplay = document.getElementById('ip-address');
          let isVisible = false;
          
          toggleButton.addEventListener('click', () => {
            isVisible = !isVisible;
            ipDisplay.className = isVisible ? 'reveal' : 'hide';
            
            setTimeout(() => {
              ipDisplay.textContent = isVisible ? ipAddress : '●●●●●●●●';
              toggleButton.textContent = isVisible ? 'Hide IP' : 'Show IP';
            }, isVisible ? 0 : 250);
          });
        })
        .catch(() => {
          document.getElementById('ip-address').textContent = 'Failed to fetch IP';
        });
      
      if (navigator.connection) {
        const connection = navigator.connection;
        document.getElementById('connection-type').textContent = connection.effectiveType || 'Unknown';
        document.getElementById('download-speed').textContent = connection.downlink ? `${connection.downlink} Mbps` : 'Unknown';
        document.getElementById('network-status').textContent = navigator.onLine ? 'Connected' : 'Disconnected';
        
        connection.addEventListener('change', () => {
          document.getElementById('connection-type').textContent = connection.effectiveType || 'Unknown';
          document.getElementById('download-speed').textContent = connection.downlink ? `${connection.downlink} Mbps` : 'Unknown';
        });
      } else {
        document.getElementById('connection-type').textContent = 'Not available';
        document.getElementById('download-speed').textContent = 'Not available';
        document.getElementById('network-status').textContent = navigator.onLine ? 'Connected' : 'Disconnected';
      }
    }
    
    function addMoreCapabilities() {
      const mediaSection = document.createElement('section');
      mediaSection.className = 'info-card';
      mediaSection.innerHTML = `
        <h2>Media Capabilities</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Camera Access</div>
            <div class="info-value" id="camera-access">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Microphone Access</div>
            <div class="info-value" id="microphone-access">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Speaker Output</div>
            <div class="info-value" id="speaker-output">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">WebRTC Support</div>
            <div class="info-value" id="webrtc-support">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(mediaSection);
      
      document.getElementById('camera-access').textContent = navigator.mediaDevices ? 'Available' : 'Not available';
      document.getElementById('microphone-access').textContent = navigator.mediaDevices ? 'Available' : 'Not available';
      document.getElementById('speaker-output').textContent = typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined' ? 'Available' : 'Not available';
      document.getElementById('webrtc-support').textContent = typeof RTCPeerConnection !== 'undefined' ? 'Supported' : 'Not supported';
      
      const hardwareSection = document.createElement('section');
      hardwareSection.className = 'info-card';
      hardwareSection.innerHTML = `
        <h2>Hardware & Sensors</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Geolocation</div>
            <div class="info-value" id="geolocation">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Device Orientation</div>
            <div class="info-value" id="device-orientation">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Vibration</div>
            <div class="info-value" id="vibration">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ambient Light</div>
            <div class="info-value" id="ambient-light">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(hardwareSection);
      
      document.getElementById('geolocation').textContent = 'geolocation' in navigator ? 'Available' : 'Not available';
      document.getElementById('device-orientation').textContent = 'DeviceOrientationEvent' in window ? 'Available' : 'Not available';
      document.getElementById('vibration').textContent = 'vibrate' in navigator ? 'Available' : 'Not available';
      document.getElementById('ambient-light').textContent = 'AmbientLightSensor' in window ? 'Available' : 'Not available';
      
      const apisSection = document.createElement('section');
      apisSection.className = 'info-card';
      apisSection.innerHTML = `
        <h2>Advanced APIs</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Web Workers</div>
            <div class="info-value" id="web-workers">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Service Workers</div>
            <div class="info-value" id="service-workers">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">IndexedDB</div>
            <div class="info-value" id="indexed-db">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Web Bluetooth</div>
            <div class="info-value" id="web-bluetooth">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(apisSection);
      
      document.getElementById('web-workers').textContent = typeof Worker !== 'undefined' ? 'Supported' : 'Not supported';
      document.getElementById('service-workers').textContent = 'serviceWorker' in navigator ? 'Supported' : 'Not supported';
      document.getElementById('indexed-db').textContent = 'indexedDB' in window ? 'Supported' : 'Not supported';
      document.getElementById('web-bluetooth').textContent = 'bluetooth' in navigator ? 'Supported' : 'Not supported';
      
      const securitySection = document.createElement('section');
      securitySection.className = 'info-card';
      securitySection.innerHTML = `
        <h2>Security & Permissions</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">HTTPS Connection</div>
            <div class="info-value" id="https-connection">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Permissions API</div>
            <div class="info-value" id="permissions-api">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Incognito Mode</div>
            <div class="info-value" id="incognito-mode">Checking...</div>
          </div>
          <div class="info-item">
            <div class="info-label">Content Blockers</div>
            <div class="info-value" id="content-blockers">Checking...</div>
          </div>
        </div>
      `;
      
      document.querySelector('main').appendChild(securitySection);
      
      document.getElementById('https-connection').textContent = window.location.protocol === 'https:' ? 'Yes' : 'No';
      document.getElementById('permissions-api').textContent = 'permissions' in navigator ? 'Available' : 'Not available';
      
      try {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) {
          document.getElementById('incognito-mode').textContent = 'Cannot detect';
        } else {
          fs(window.TEMPORARY, 100, 
            () => document.getElementById('incognito-mode').textContent = 'Likely No',
            () => document.getElementById('incognito-mode').textContent = 'Likely Yes'
          );
        }
      } catch (e) {
        document.getElementById('incognito-mode').textContent = 'Cannot detect';
      }
      
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      window.setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          document.getElementById('content-blockers').textContent = 'Detected';
        } else {
          document.getElementById('content-blockers').textContent = 'Not detected';
        }
        testAd.remove();
      }, 100);
    }
    
    setTimeout(addDetailedInfo, 500);
    
    setTimeout(addMoreCapabilities, 800);
  });