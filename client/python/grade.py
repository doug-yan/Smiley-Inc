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
from aubio import source, onset

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

  total_frames = 0

  while True:
    samples, read = source()
    pitch = pitch_o(samples)[0]
    confidence = pitch_o.get_confidence()
    pitches += [pitch]
    confidences += [confidence]
    total_frames += read
    if read < hop_s: break

  #Clean up pitches
  pitches = np.ma.masked_where(confidences < tolerance, np.array(pitches))

  return pitches, np.array(confidences)


def get_notes_with_onsets(song, win_s = 512, hop_s = 256, samplerate = 44100, tolerance = 0.8):
  pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)
  pitch_o.set_unit("midi")
  pitch_o.set_tolerance(tolerance)
  o = onset("default", win_s, hop_s, samplerate)

  notes = []

  cur_note = -1
  while True:
    samples, read = song()
    pitch = pitch_o(samples)[0]
    if pitch < 1 and read == hop_s: # Removes silence -- should we keep it instead?
      continue
    confidence = pitch_o.get_confidence()
    if confidence < tolerance and read == hop_s: # Aren't sure enough about reading this note
      continue
    if o(samples): # Reached a new note
      notes.append((o.get_last(), [(pitch, confidence)]))
    else:
      if len(notes) == 0: continue
      notes[-1][1].append((pitch, confidence))
    if read < hop_s: break


def main():
  if len(sys.argv) < 3:
    print "Incorrect number of command line arguments"
    return 1

  reference_name = sys.argv[1]
  reference_name = '../audio/acapella/' + reference_name

  karaoke_name = sys.argv[2] # Gotta figure out how this is stored

  s_reference = load_file(reference_name)
  # s_karaoke = load_file(karaoke_name)

  ref_notes = get_notes_with_onsets(s_reference)
  # karaoke_notes = get_notes_with_onsets(s_karaoke)

  print ref_notes[1]
  print ref_notes[2]

  # reference_song = sys.argv[1]
  # reference_song = '../audio/acapella/' + reference_song
  #
  # karaoke_performance = sys.argv[2] #Need to figure out how this will be stored
  #
  # y_reference, sr_reference = librosa.load(reference_song, duration = 20)
  # pitches, magnitudes = librosa.piptrack(y_reference, sr_reference)
  #
  # onset_frames = librosa.onset.onset_detect(y=y_reference, sr=sr_reference)
  # onset_times = librosa.frames_to_time(onset_frames, sr=sr_reference)
  #
  # print(onset_times)
  # print(onset_frames)
  #
  # new_notes = []
  #
  # prev_frame = onset_frames[0]
  # for frame in onset_frames[1:]:
  #   window = y_reference[prev_frame:frame]
  #   pitches, magnitudes = librosa.piptrack(window, sr_reference, fmin=50, fmax=900)
  #   if max(magnitudes) == 0:
  #     continue
  #   greatest_magnitude = magnitudes == max(magnitudes)
  #   print max(magnitudes)
  #   print pitches[greatest_magnitude]
  #   new_notes.append(librosa.hz_to_note(pitches[greatest_magnitude]))
  #
  # print new_notes
  #
  # notes = []
  #
  # return 0

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
