using System.Security.Cryptography;

namespace CvMaker.Api.Services;

public class RsaKeyService
{
    private readonly RSA _rsa;

    public RsaKeyService()
    {
        _rsa = RSA.Create(2048);
    }

    public string GetPublicKey()
    {
        // Export the public key in PEM format (SubjectPublicKeyInfo)
        return _rsa.ExportSubjectPublicKeyInfoPem();
    }

    public string? Decrypt(string encryptedText)
    {
        try
        {
            var bytes = Convert.FromBase64String(encryptedText);
            var decryptedBytes = _rsa.Decrypt(bytes, RSAEncryptionPadding.Pkcs1);
            return System.Text.Encoding.UTF8.GetString(decryptedBytes);
        }
        catch (Exception)
        {
            // If decryption fails, return null or throw. 
            // Returning null allows the caller to handle it (e.g. treat as invalid password)
            return null;
        }
    }
}
