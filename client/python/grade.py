#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import numpy as np
import subprocess
import aubio
from aubio import source, onset, freqtomidi

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


def regularize_times(reference, karaoke):
  first_time = reference[0][1]
  for note_row in reference:
    note_row[1] = note_row[1] - first_time
    note_row[2] = note_row[2] - first_time
  first_time = karaoke[0][1]
  for note_row in karaoke:
    note_row[1] = note_row[1] - first_time
    note_row[2] = note_row[2] - first_time
  return reference, karaoke


def notes_to_ints(reference, karaoke):
  for i in range(len(reference)):
    reference[i] = [eval(num) for num in reference[i]]
  for i in range(len(karaoke)):
    karaoke[i] = [eval(num) for num in karaoke[i]]
  return reference, karaoke


'''
  Note format is as follows:
  [midi, time started, time ended]
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
  # reference, karaoke = regularize_times(reference, karaoke)
  # for row in zip(reference[0:50], karaoke[0:50]):
  #   row = [row[0][0], row[1][0], str(row[0][1]), str(row[1][1]), str(row[0][2]), str(row[1][2])]
  #   print " ".join(note for note in row)

  super_error_count = 0
  error_amount = 0
  error_cutoff = 11 # 2 midi octaves

  reference, karaoke = notes_to_ints(reference, karaoke)
  reference, karaoke = regularize_times(reference, karaoke)

  karaoke_index = 0

  for i in range(len(reference) - 1):
    cur_time_diff = abs(karaoke[karaoke_index][1] - reference[i][1])
    cur_error = abs(karaoke[karaoke_index][0] - reference[i][0])
    while karaoke_index < len(karaoke) and cur_time_diff <= 1 and \
          (cur_time_diff <= abs(karaoke[karaoke_index][1] - reference[i+1][1]) or \
          cur_error <= abs(karaoke[karaoke_index][0] - reference[i+1][0])):

      if cur_error < error_cutoff:
        error_amount += cur_error
      else:
        super_error_count += 1

      karaoke_index += 1
      cur_time_diff = abs(karaoke[karaoke_index][1] - reference[i][1])
      cur_error = abs(karaoke[karaoke_index][0] - reference[i][0])

  if super_error_count > karaoke_index / 2:
    return 'You failed! 💩💩💩'
  return error_amount / karaoke_index


def main():
  reference_name = '30_Seconds_to_Mars_-_The_Kill.mp3'
  # reference_name = sys.argv[1]
  reference_name = '../audio/acapella/' + reference_name

  if len(sys.argv) == 2:
    print get_notes(reference_name)
    return 0

  karaoke_name = '../audio/karaoke/Karaoke_Titanium_-_Sia.m4a'
  # karaoke_name = sys.argv[2] # Gotta figure out how this is stored

  ref_notes = get_notes(reference_name)
  karaoke_notes = get_notes(karaoke_name)

  print grade(ref_notes, karaoke_notes)

if __name__ == '__main__':
  status = main()
  sys.exit(status)
