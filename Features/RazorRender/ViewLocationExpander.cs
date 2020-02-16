using System.Linq;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Collections.Generic;

namespace Deepcove_Trust_Website.Features.RazorRender
{
    public class ViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            var locations = new[] { "Views/Emails/{0}.cshtml", "Views/Errors/{0}.cshtml"};
            return locations.Union(viewLocations);
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
            context.Values["customviewlocation"] = nameof(ViewLocationExpander);
        }
    }
}
