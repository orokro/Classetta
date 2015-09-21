"""
	This file takes a text file of source code (doesn't matter what language)

	And converts it to a string suitable for pasting into javascript.
"""
from sys import argv
import textwrap

#useful function to split into even lines
def split_str(seq, chunk, skip_tail=False):
    lst = []
    if chunk <= len(seq):
        lst.extend([seq[:chunk]])
        lst.extend(split_str(seq[chunk:], chunk, skip_tail))
    elif not skip_tail and seq:
        lst.extend([seq])
    return lst

# get the file name from the command line argument
script, fileName = argv

# open the file so we can read it
myFile = open(fileName)

# get the contents of the file
txt = myFile.read()

# replace all stupid windows newlines with single "\n" character
txt = txt.replace("\r\n", "\n")

# split into even lines
lines = split_str(txt, 80)

# loop over lines and rejoin them into a string with proper js syntax
ret = "return "
for l in lines:

    # now we should relpace all tabs with "\t"
    l = l.replace("\t", "\\t")

    # and replace all newlines with "\n"
    l = l.replace("\n", "\\n")

    # make sure to escape all quotes:
    l = l.replace("\"", "\\\"")

    ret += "\t\"" + l + "\"+\n\t"

# Lazy way of terminating the concatentation
ret += "\t\"\";";

# output our nicely formatted text
print ret