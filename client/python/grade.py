#!/usr/bin/env python

import librosa
import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import analyse
import pyaudio
import midi
import subprocess
import aubio
from aubio import source, onset

def get_notes_with_onsets(song, win_s = 512, hop_s = 256, samplerate = 44100, tolerance = 0.8):
  pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)
  pitch_o.set_unit("midi")
  pitch_o.set_tolerance(tolerance)
  o = onset("default", win_s, hop_s, samplerate)

  notes = []

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
  return notes


'''
  Note format is as follows:
  [hz, time started, time ended]
'''
def get_notes(filename):
  notes = subprocess.check_output(["aubionotes", "-i", filename])
  notes = filter(lambda x: len(x) == 3, map(lambda x: x.split('\t'), notes.split('\n')))
  return notes


'''
  Grading scheme 1: cumulative error
    Go through both lists of notes, counting number of incorrect notes
    If their lengths aren't the same, extra notes are counted wrong
    No attention is paid to timing, nor magnitude of difference
'''
def grade(reference, karaoke):
  error_count = 0
  for i in range(min(len(reference), len(karaoke))):
    if i == len(reference) or i == len(karaoke):
      error_count += max(len(reference), len(karaoke)) - i + 1
    else:
      if reference[i][0] != karaoke[i][0]:
        error_count += 1
  return error_count


def main():

  # if len(sys.argv) < 3:
  #   print "Incorrect number of command line arguments"
  #   return 1

  reference_name = 'Titanium_-_Sia.mp3'
  # reference_name = sys.argv[1]
  reference_name = '../audio/acapella/' + reference_name

  karaoke_name = '../audio/karaoke/Karaoke_Titanium_-_Sia.m4a'
  # karaoke_name = sys.argv[2] # Gotta figure out how this is stored

  ref_notes = get_notes(reference_name)
  karaoke_notes = get_notes(karaoke_name)

  print len(ref_notes)
  print len(karaoke_notes)
  print grade(ref_notes, karaoke_notes)


if __name__ == '__main__':
  status = main()
  sys.exit(status)
