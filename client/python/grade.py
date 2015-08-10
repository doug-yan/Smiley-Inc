#!/usr/bin/env python

import librosa
import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import analyse
import pyaudio
import midi
import aubio
from aubio import source
from demo_waveform_plot import get_waveform_plot, set_xlabels_sample2time

def array_from_text_file(filename, dtype = 'float'):
  import os.path
  from numpy import array
  filename = os.path.join(os.path.dirname(__file__), filename)
  return array([line.split() for line in open(filename).readlines()],
    dtype = dtype)

# hop_s is hop size
def load_file(filename, samplerate = 44100, hop_s = 512):
  return source(filename, samplerate, hop_s)

# win_s is fft size
# tolerance is liable to change
def read_pitch(source, tolerance = 0.8, win_s = 4096, hop_s = 512, samplerate = 44100):
  # For some reason 'from aubio import pitch' won't work???
  pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)
  pitch_o.set_unit("midi")
  pitch_o.set_tolerance(tolerance)

  pitches = []
  confidences = []

  total_frame = 0
  while True:
    samples, read = s()
    pitch = pitch_o(samples)[0]
    confidence = pitch_o.get_confidence()
    pitches += [pitch]
    total_frames += read
    if read < hop_s: break
  return pitches, confidences

def main():
  if len(sys.argv) < 3:
    print "Incorrect number of command line arguments"
    return 1

  reference_name = sys.argv[1]
  reference_name = '../audio/acapella/' + reference_name

  karaoke_name = sys.argv[2] # Gotta figure out how this is stored

  s_reference = load_file(reference_name)
  s_karaoke = load_file(karaoke_name)

  ref_pitches, ref_confidences = read_pitch(s_reference)
  karaoke_pitches, karaoke_confidences = read_pitch(s_karaoke)

  

  # skip = 1
  #
  # pitches = np.array(pitches[skip:])
  # confidences = np.array(confidences[skip:])
  # times = [t * hop_s for t in range(len(pitches))]
  #
  # fig = plt.figure()
  #
  # ax1 = fig.add_subplot(311)
  # ax1 = get_waveform_plot(filename, samplerate = samplerate, block_size = hop_s, ax = ax1)
  # plt.setp(ax1.get_xticklabels(), visible = False)
  # ax1.set_xlabel('')
  #
  # ax2 = fig.add_subplot(312, sharex = ax1)
  # ground_truth = os.path.splittext(filename)[0] + '.f0.Corrected'
  # if os.path.isfile(ground_truth):
  #   ground_truth = array_from_text_file(ground_truth)
  #   true_freqs = ground_truth[:, 2]
  #   true_freqs = np.ma.masked_where(true_freqs < 2, true_freqs)
  #   true_times = float(samplerate) * ground_truth[:, 0]
  #   ax2.plot(true_times, true_freqs, 'r')
  #   ax2.axis( ymin = 0.9 * true_freqs.min(), ymax = 1.1 * true_freqs.max() )
  #
  # ax2.plot(times, pitches, '.g')
  # cleaned_pitches = pitches
  # cleaned_pitches = np.ma.masked_where(confidences < tolerance, cleaned_pitches)
  # ax2.plot(times, cleaned_pitches, '.-')
  #
  # plt.setp(ax2.get_xticklabels(), visible=False)
  # ax2.set_ylabel('f0 (midi)')
  #
  # ax3 = fig.add_subplot(313, sharex = ax1)
  # ax3.plot(times, confidences)
  # ax3.plot(times, [tolerance] * len(confidences))
  # ax3.axis( xmin =times[0], xmax = times[-1])
  # ax3.set_ylabel('confidence')
  # set_xlabels_sample2time(ax3, times[-1], samplerate)
  # plt.show()
  #
  # return 0



  reference_song = sys.argv[1]
  reference_song = '../audio/acapella/' + reference_song

  karaoke_performance = sys.argv[2] #Need to figure out how this will be stored

  y_reference, sr_reference = librosa.load(reference_song, duration = 20)
  pitches, magnitudes = librosa.piptrack(y_reference, sr_reference)

  onset_frames = librosa.onset.onset_detect(y=y_reference, sr=sr_reference)
  onset_times = librosa.frames_to_time(onset_frames, sr=sr_reference)

  print(onset_times)
  print(onset_frames)

  new_notes = []

  prev_frame = onset_frames[0]
  for frame in onset_frames[1:]:
    window = y_reference[prev_frame:frame]
    pitches, magnitudes = librosa.piptrack(window, sr_reference, fmin=50, fmax=900)
    if max(magnitudes) == 0:
      continue
    greatest_magnitude = magnitudes == max(magnitudes)
    print max(magnitudes)
    print pitches[greatest_magnitude]
    new_notes.append(librosa.hz_to_note(pitches[greatest_magnitude]))

  print new_notes

  notes = []

  return 0

  # for index, pitch in enumerate(filter(lambda x: max(x) > 0, pitches.transpose())):
  #   b = magnitudes.transpose()[index] == max(magnitudes.transpose()[index])
  #   notes.append((index + 1, librosa.hz_to_note(pitch[b])))
  #
  # pattern = midi.Pattern()
  # track = midi.Track()
  # pattern.append(track)
#
# prev = (0, 0)
# note_on = False
# for (index, note) in notes:
#   if note != prev[1]:
#     if note_on:
#       off = midi.NoteOffEvent(tick = prev[0], velocity = 127, pitch = eval('midi'))
#       track.append(off)
#     else:
#       note_on = True
#     on = midi.NoteOnEvent(tick = index, velocity = 127, pitch = note)
#     track.append(on)
#   prev = (index, note)
#
# eot = midi.EndOfTrackEvent(tick = prev[0] + 1)
# track.append(eot)
# print pattern
# midi.write_midifile('example.mid', pattern)
#
# # plt.plot(np.arange(y_reference.size), y_reference)
# # plt.show()
#
# audio_path = librosa.util.example_audio_file()
# y, sr = librosa.load(audio_path)

# for i in range(0, y_reference.size, 1024):
#   print analyse.loudness(y_reference[i : i + 1024])
#   print analyse.musical_detect_pitch(y_reference[i : i+1024])

# y_karaoke, sr_karaoke = librosa.load(karaoke_performance, duration = 20)
#
# reference_tempo, reference_beat_frames = librosa.beat.beat_track(y_reference, sr_reference)
# karaoke_tempo, karaoke_beat_frames = librosa.beat.beat_track(y_karaoke, sr_karaoke)
#
# beat_variance = sum(abs(reference_beat_frames - karaoke_beat_frames) ** 2) / len(reference_beat_frames)
#
# reference_pitches, reference_magnitudes = librosa.piptrack(y_reference, sr_reference, threshold=.25)
# print reference_pitches.shape
#
# print beat_variance

if __name__ == '__main__':
  status = main()
  sys.exit(status)
