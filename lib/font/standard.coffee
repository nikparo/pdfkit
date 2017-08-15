AFMFont = require './afm'
PDFFont = require '../font'
# fs = require 'fs'

class StandardFont extends PDFFont
  constructor: (@document, @name, @id) ->
    @font = new AFMFont STANDARD_FONTS[@name]()
    {@ascender,@descender,@bbox,@lineGap} = @font
    
  embed: ->
    @dictionary.data =
      Type: 'Font'
      BaseFont: @name
      Subtype: 'Type1'
      Encoding: 'WinAnsiEncoding'
      
    @dictionary.end()
    
  encode: (text) ->
    encoded = @font.encodeText text
    glyphs = @font.glyphsForString '' + text
    advances = @font.advancesForGlyphs glyphs
    positions = []
    for glyph, i in glyphs
      positions.push
        xAdvance: advances[i]
        yAdvance: 0
        xOffset: 0
        yOffset: 0
        advanceWidth: @font.widthOfGlyph glyph
      
    return [encoded, positions]
    
  widthOfString: (string, size) ->
    glyphs = @font.glyphsForString '' + string
    advances = @font.advancesForGlyphs glyphs
    
    width = 0
    for advance in advances
      width += advance
    
    scale = size / 1000  
    return width * scale
    
  @isStandardFont: (name) ->
    return name of STANDARD_FONTS
    
  # This insanity is so browserify can inline the font files
  STANDARD_FONTS =
    # "Helvetica":             -> fs.readFileSync __dirname + "/../font/data/Helvetica.afm", 'utf8'
    "Helvetica": -> """
StartFontMetrics 4.1
FontName Helvetica
FullName Helvetica
FamilyName Helvetica
Weight Medium
ItalicAngle 0
IsFixedPitch false
CharacterSet ExtendedRoman
FontBBox -166 -225 1000 931 
UnderlinePosition -100
UnderlineThickness 50
Version 002.000
EncodingScheme AdobeStandardEncoding
CapHeight 718
XHeight 523
Ascender 718
Descender -207
StdHW 76
StdVW 88
StartCharMetrics 1
C -1 ; WX 556 ; N Euro ; B 0 0 0 0 ;
EndCharMetrics
StartKernData
StartKernPairs 1
KPX A C -30
EndKernPairs
EndKernData
EndFontMetrics
"""
  
module.exports = StandardFont
