import { parseDom } from "./parse";


let node = parseDom(`<body>
                    Hello, world!
                    <div class='myClass'>Nested
                        <br></br> 
                        node

                        a
                         b       ss
                        hello<!-- 2321341 -->world 
                    </div>
                    </body>`)

