// Code generated by qtc from "nav.qtpl". DO NOT EDIT.
// See https://github.com/valyala/quicktemplate for details.

//line tpl/nav.qtpl:1
package tpl

//line tpl/nav.qtpl:1
import (
	qtio422016 "io"

	qt422016 "github.com/valyala/quicktemplate"
)

//line tpl/nav.qtpl:1
var (
	_ = qtio422016.Copy
	_ = qt422016.AcquireByteBuffer
)

//line tpl/nav.qtpl:2
type NavItem struct {
	Name string
	Url  string
}

//line tpl/nav.qtpl:8
func StreamPrintNavItems(qw422016 *qt422016.Writer, current string, items []NavItem) {
//line tpl/nav.qtpl:8
	qw422016.N().S(`
<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
            `)
//line tpl/nav.qtpl:13
	for _, item := range items {
//line tpl/nav.qtpl:13
		qw422016.N().S(`
                <li class="nav-item">
                    <a class="nav-link`)
//line tpl/nav.qtpl:15
		if current == item.Name {
//line tpl/nav.qtpl:15
			qw422016.N().S(` active`)
//line tpl/nav.qtpl:15
		}
//line tpl/nav.qtpl:15
		qw422016.N().S(`" href="`)
//line tpl/nav.qtpl:15
		qw422016.E().S(item.Url)
//line tpl/nav.qtpl:15
		qw422016.N().S(`">
                        `)
//line tpl/nav.qtpl:16
		qw422016.E().S(item.Name)
//line tpl/nav.qtpl:16
		qw422016.N().S(`
                    </a>
                </li>
            `)
//line tpl/nav.qtpl:19
	}
//line tpl/nav.qtpl:19
	qw422016.N().S(`
        </ul>
  </div>
</nav>
`)
//line tpl/nav.qtpl:23
}

//line tpl/nav.qtpl:23
func WritePrintNavItems(qq422016 qtio422016.Writer, current string, items []NavItem) {
//line tpl/nav.qtpl:23
	qw422016 := qt422016.AcquireWriter(qq422016)
//line tpl/nav.qtpl:23
	StreamPrintNavItems(qw422016, current, items)
//line tpl/nav.qtpl:23
	qt422016.ReleaseWriter(qw422016)
//line tpl/nav.qtpl:23
}

//line tpl/nav.qtpl:23
func PrintNavItems(current string, items []NavItem) string {
//line tpl/nav.qtpl:23
	qb422016 := qt422016.AcquireByteBuffer()
//line tpl/nav.qtpl:23
	WritePrintNavItems(qb422016, current, items)
//line tpl/nav.qtpl:23
	qs422016 := string(qb422016.B)
//line tpl/nav.qtpl:23
	qt422016.ReleaseByteBuffer(qb422016)
//line tpl/nav.qtpl:23
	return qs422016
//line tpl/nav.qtpl:23
}
