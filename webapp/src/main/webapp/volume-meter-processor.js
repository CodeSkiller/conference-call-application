// Copyright (c) 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/* global currentTime */

var SMOOTHING_FACTOR = 0.8;
var FRAME_PER_SECOND = 60;
var FRAME_INTERVAL = 1 / FRAME_PER_SECOND;

/**
 *  Measure microphone volume.
 *
 * @class VolumeMeter
 * @extends AudioWorkletProcessor
 */
class VolumeMeter extends AudioWorkletProcessor {
  constructor() {
    super();
    this._lastUpdate = currentTime;
    this._volume = 0;
  }

  calculateRMS(inputChannelData) {
    // Calculate the squared-sum.
    var sum = 0;
    for (var i = 0; i < inputChannelData.length; i++) {
      sum += inputChannelData[i] * inputChannelData[i];
    }

    // Calculate the RMS level and update the volume.
    var rms = Math.sqrt(sum / inputChannelData.length);
    this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
  }
  process(inputs, outputs) {
    var inputChannelData = inputs[0][0];

    // Post a message to the node every 16ms.
    if (currentTime - this._lastUpdate > FRAME_INTERVAL) {
      this.calculateRMS(inputChannelData);
      this.port.postMessage(this._volume);
      this._lastUpdate = currentTime;
    }
    return true;
  }
}

registerProcessor("volume-meter", VolumeMeter);
