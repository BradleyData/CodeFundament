# PatternLab
## NPM Scripts
### clean
Deletes all generated content from **www** where the Pattern Library is served from.
### lint
Runs prettier and eslint against all ***.hbs**, ***.json*, ***.md*, ***.scss*, and ***.ts* files in **app/src**.
### buildPatternLab
Generates the Pattern Library in **www** using the content from **app/src**.
### compileSass
Concatenates all ***.scss* files into a single file and compiles it as CSS. It is important to note that any files declaring variables used in other files should use the **.var.scss** extension so be sure they are concatenated first.
### compileTypescript
Concatenates all ***.ts* files into a single file and compiles it as JS.
### export
Uses the content currently in the Pattern Library to create the actual static website. Only the CSS, JS, and Pages are exported; patterns and templates are ignored.
## Directory Structure
All of the code is in a volume mounted to **app**. Everything else is part of the container and will be reset when the container is restarted/rebuilt.
### app/helpers
Custom Handlebars helpers.
### app/pattern_exports
The generated static website.
### app/src
All source code goes here.
  - _data: Global JSON data used by the pattern templates to replace Handlebars variables.
  - _meta: Gobal headers and footers used by PatternLab and generally best left alone.
  - _patterns: All of the pattern files. Each pattern may have a **.hbs*, **.md*, **.scss*, **.ts* file associated with it along with multiple **.json** files.
  - assets: All fonts, images, audio, videos, etc. This is a mounted volume to keep all of these assets out of the same repository as the code. The path to these assets can be set in the **.env** file in the root directory.
  - css: Global SCSS that is not directly associated with a pattern.
  - js: Global typescript that is not directly associated with a pattern.
### app/www
The generated Pattern Library.
