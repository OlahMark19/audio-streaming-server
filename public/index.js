document.addEventListener('DOMContentLoaded', () => {
    let audioContext;
    let mediaRecorder;
    let audioChunks = [];
    let microphoneStream;
    let scriptProcessorNode;
    let liveAudioSource;

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.addEventListener('click', () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          microphoneStream = stream;

          // Create a ScriptProcessorNode for live monitoring
          scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessorNode.onaudioprocess = onAudioProcess;

          // Connect the microphone stream to the scriptProcessorNode and audio context destination
          const microphoneSource = audioContext.createMediaStreamSource(microphoneStream);
          microphoneSource.connect(scriptProcessorNode);
          scriptProcessorNode.connect(audioContext.destination);

          // Create a MediaRecorder for recording
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            // Combine and play the entire recorded audio
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

          };

          // Start recording
          mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    });

    stopButton.addEventListener('click', () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        // Stop live monitoring
        scriptProcessorNode.disconnect();
      }
    });

    function onAudioProcess(event) {
      // Pass the live audio data to the playback source
      const inputData = event.inputBuffer.getChannelData(0);
      const outputData = event.outputBuffer.getChannelData(0);

      for (let sample = 0; sample < inputData.length; sample++) {
        outputData[sample] = inputData[sample];
      }
    }  
  });