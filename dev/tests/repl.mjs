/// <reference types="jsstp" />
import jsstp from "../../src/jsstp.mjs"
//
import repl from "repl"

repl.start().context.jsstp = jsstp
