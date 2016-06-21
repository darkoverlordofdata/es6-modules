# es6-modules

ES6 Module Implementation

## Overview

Provides an es6 module loader implementation for typescript generated polyfill.

Typescript 1.8 adds the new jsconfig.json format. When the compilerOptions.module field 
is set to 'system' or 'amd' and compilerOptions.outFile is also so, typescript will 
bundle multiple files, transpiling import/export polyfils. This project supplies an
implementation for those polyfils.

