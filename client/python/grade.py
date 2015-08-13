#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import numpy as np
import subprocess
import aubio
from aubio import source, onset, freqtomidi

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
  return regularize_times(reference, karaoke)


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
    Go through both lists of notes
    To determine how notes are lined up:
      The time difference is less than one second
      AND
        Time difference between current reference note and karaoke note is less than
          time difference between next reference note and karaoke note
        OR
        Note error between current reference note and karaoke note is less than
          time difference between next reference note and karaoke note
    Error isn't counted when difference is greater than an octave
      HOWEVER, such comparisons are counted, and if more than half of all comparisons have more
        than that error, total failure is returned
    Returns average error over all compared notes
'''
def grade(reference, karaoke):
  super_error_count = 0
  error_amount = 0
  error_cutoff = 11 # 2 midi octaves

  reference, karaoke = notes_to_ints(reference, karaoke)

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
  # reference_name = '30_Seconds_to_Mars_-_The_Kill.mp3'
  reference_name = sys.argv[1]
  reference_name = '../audio/acapella/' + reference_name

  if len(sys.argv) == 2:
    print get_notes(reference_name)
    return 0

  # karaoke_name = '../audio/karaoke/Karaoke_Titanium_-_Sia.m4a'
  karaoke_name = sys.argv[2] # Gotta figure out how this is stored

  ref_notes = get_notes(reference_name)
  karaoke_notes = get_notes(karaoke_name)

  print grade(ref_notes, karaoke_notes)

if __name__ == '__main__':
  status = main()
  sys.exit(status)