echo 正在更新git服务器
git pull

echo 正在同步SVN服务器
xcopy C:\Users\xianweijan\Desktop\Working\darlingmanagementplatform\*.* C:\Users\xianweijan\Desktop\Proc_Release\darlingmanagementplatform /S /F /R /Y /E


echo 正在提交SVN服务器

cd C:\Users\xianweijan\Desktop\Proc_Release 
svn ci *
 

cmd /k