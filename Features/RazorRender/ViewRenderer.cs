using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;


namespace Deepcove_Trust_Website.Features.RazorRender
{
    public class ViewRenderer : IViewRenderer
    {
        private readonly IRazorViewEngine _ViewEngine;
        private readonly ITempDataProvider _TempDataProvider;
        private readonly IServiceProvider _ServiceProvider;

        
        public ViewRenderer(IRazorViewEngine viewEngine, ITempDataProvider tempDataProvider, IServiceProvider serviceProvider)
        {
            _ViewEngine = viewEngine;
            _TempDataProvider = tempDataProvider;
            _ServiceProvider = serviceProvider;
        }

        public async Task<string> RenderAsync<TModel>(string name, TModel model)
        {
            var actionContext = GetActionContext();

            var viewEngineResult = _ViewEngine.FindView(actionContext, name, false);
            if (viewEngineResult.Success == false)
                throw new InvalidOperationException($"The {name} view couldn't be found");

            var view = viewEngineResult.View;

            using(var output = new StringWriter())
            {
                await WriteToOutputAsync(model, actionContext, view, output);
                return output.ToString();
            }
        }

        private ActionContext GetActionContext()
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = _ServiceProvider
            };

            return new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        }

        private async Task WriteToOutputAsync<TModel>(TModel model, ActionContext actionContext, IView view, TextWriter output)
        {
            var viewContext = new ViewContext(
                actionContext,
                view,
                new ViewDataDictionary<TModel>(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = model
                },
                new TempDataDictionary(
                    actionContext.HttpContext,
                    _TempDataProvider
                ),
                output,
                new HtmlHelperOptions()
            );

            await view.RenderAsync(viewContext);
        }
    }
}
