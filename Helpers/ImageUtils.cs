using SixLabors.ImageSharp;
using SixLabors.Primitives;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using SixLabors.ImageSharp.PixelFormats;
using Newtonsoft.Json;

namespace Deepcove_Trust_Website.Helpers
{
    /// <summary>
    /// Simple enumeration class
    /// </summary>
    public class ImageVersion : IComparable<ImageVersion>
    {
        [JsonProperty("code")]
        public string Code { get; private set; }
        [JsonProperty("width")]
        public int Width { get; private set; }

        public static List<ImageVersion> All { get => new List<ImageVersion>() { XS, S, M, L, XL, XXL }; }

        public static ImageVersion XXL = new ImageVersion { Code = "XXL", Width = 2500 };
        public static ImageVersion XL = new ImageVersion { Code = "XL", Width = 1500 };
        public static ImageVersion L = new ImageVersion { Code = "L", Width = 1000 };
        public static ImageVersion M = new ImageVersion { Code = "M", Width = 750 };
        public static ImageVersion S = new ImageVersion { Code = "S", Width = 500 };
        public static ImageVersion XS = new ImageVersion { Code = "XS", Width = 300 };

        public static ImageVersion CustomVersion(int width) => new ImageVersion { Code = "Custom", Width = width };

        public int CompareTo(ImageVersion other) => Width.CompareTo(other.Width);        
    }

    public class CropData
    {
        public int x, y, width, height;
    }

    public static class ImageUtils
    {
        /// <summary>
        /// Crops the in-memory Image according to the arguments provided.
        /// </summary>
        /// <param name="image">The in-memory image to be cropped.</param>
        /// <param name="x">X coordinate of the top left corner of the rectangle to be retained.</param>
        /// <param name="y">Y coordinate of the top left corner of the rectangle to be retained.</param>
        /// <param name="width">Width (in pixels) of the rectangle to be retained.</param>
        /// <param name="height">Height (in pixels) of the rectangle to be retained.</param>
        private static void CropImage(Image image, CropData cropData)
        {
            image.Mutate(ctx => ctx.Crop(
                new Rectangle(cropData.x, cropData.y, cropData.width, cropData.height)));
        }

        /// <summary>
        /// Saves an Image to the specified path and creates scaled down copies where appropriate.
        /// 
        /// Use within a try-catch.
        /// </summary>
        /// <returns>Dictionary to be peristed in the database, under [ImageMedia.Filenames].</returns>
        public static Dictionary<string, dynamic> SaveImage(Image image, string path, CropData cropData = null)
        {
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException("Path must not be null or empty.");

            // If crop instructions are provided, crop the image before saving.
            if (cropData != null)
                CropImage(image, cropData);

            // Save the original image
            image.Save(path);

            // Save any required smaller versions of the image, return results to calling method.
            return SaveScaledCopies(image, Path.GetFileName(path));
        }

        public static Dictionary<string, dynamic> SaveImage(byte[] imageBytes, string path, CropData cropData = null)
        {
            Image image = Image.Load(imageBytes);
            return SaveImage(image, path, cropData);
        }

        public static Dictionary<string, dynamic> SaveImage(string base64Image, string path, CropData cropData = null)
        {
            Image image = Image.Load(base64Image.DecodeBase64Bytes());
            return SaveImage(image, path, cropData);
        }

        /// <summary>
        /// Save smaller copies of the source image, for displaying on different screen sizes.
        /// 
        /// Copies will be stored in a directory bearing the same filename as the source image,
        /// and will have a code (e.g. XXL) prepended to the filename. To delete the scaled
        /// copies of an image, simply delete the folder bearing the same name (minus extension).
        /// 
        /// Passes back a dictionary of size codes for the sizes that have been saved - this will
        /// be saved to the database record for the uploaded image.
        /// 
        /// Use within a try-catch.
        /// </summary>
        /// <param name="image"></param>
        /// <param name="filename"></param>
        /// <returns></returns>
        private static Dictionary<string, dynamic> SaveScaledCopies(Image image, string filename)
        {
            List<ImageVersion> versions = new List<ImageVersion>();
            string basePath = Path.Combine("Storage", "Media", "Images", Path.GetFileNameWithoutExtension(filename));
            Directory.CreateDirectory(basePath);

            // Collect initial metadata on the image
            int initialWidth = image.Width;
            int initialHeight = image.Height;


            // Iterate through each of the predefined widths, and create a copy 
            // of the image at this width - unless the image is already smaller
            // than the width.
            List<ImageVersion> allVersions = ImageVersion.All;
            allVersions.Reverse();
            foreach (ImageVersion version in allVersions)
            {
                if (image.Width > version.Width)
                {
                    ScaleImage(image, version.Width);
                    image.Save(Path.Join(basePath, $"{version.Code}_{filename}"));
                    versions.Add(version);
                }
            }            

            return new Dictionary<string, dynamic> {
                { "width", initialWidth },
                {"height", initialHeight },
                { "size", new FileInfo(Path.Combine("Storage", "Media", "Images", filename)).Length },
                {"versions", versions }
            };
        }

        /// <summary>
        /// Scales the in-memory image according to the width provided.
        /// </summary>
        /// <param name="width">Width in pixels</param>
        private static void ScaleImage(Image image, int width)
        {
            // Setting width as 0 means that ImageSharp will maintain aspect ratio.
            image.Mutate(ctx => ctx.Resize(new Size(width, 0)));
        }
    }
}
