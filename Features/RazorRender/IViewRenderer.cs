using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Features.RazorRender
{
    public interface IViewRenderer
    {
        Task<string> RenderAsync<TModel>(string path, TModel model);
    }
}
