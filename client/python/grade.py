import librosa
import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import analyse
import pyaudio
import midi

reference_song = sys.argv[1]
reference_song = '../audio/acapella/' + reference_song

karaoke_performance = sys.argv[2] #Need to figure out how this will be represented

y_reference, sr_reference = librosa.load(reference_song, offset = 10, duration = 10)
pitches, magnitudes = librosa.piptrack(y_reference, sr_reference)

notes = []

for index, pitch in enumerate(filter(lambda x: max(x) > 0, pitches.transpose())):
  b = magnitudes.transpose()[index] == max(magnitudes.transpose()[index])
  notes.append((index + 1, librosa.hz_to_note(pitch[b])))

pattern = midi.Pattern()
track = midi.Track()
pattern.append(track)

prev = (0, 0)
note_on = False
for (index, note) in notes:
  if note != prev[1]:
    if note_on:
      off = midi.NoteOffEvent(tick = prev[0], velocity = 127, pitch = eval('midi'))
      track.append(off)
    else:
      note_on = True
    on = midi.NoteOnEvent(tick = index, velocity = 127, pitch = note)
    track.append(on)
  prev = (index, note)

eot = midi.EndOfTrackEvent(tick = prev[0] + 1)
track.append(eot)
print pattern
midi.write_midifile('example.mid', pattern)

# plt.plot(np.arange(y_reference.size), y_reference)
# plt.show()

audio_path = librosa.util.example_audio_file()
y, sr = librosa.load(audio_path)

# for i in range(0, y_reference.size, 1024):
#   print analyse.loudness(y_reference[i : i + 1024])
#   print analyse.musical_detect_pitch(y_reference[i : i+1024])

# y_karaoke, sr_karaoke = librosa.load(karaoke_performance, offset = 5, duration = 10)
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
