# Colin's ALM Corner Build Tasks - Version Assemblies

![Version Assemblies Task](../../images/ss_versionAssemblies.png)

## Overview
This task versions assemblies so that the assembly version matches the version portion of the build number.

## Settings
The task requires the following settings:

1. **Source Path**: path to the sources that contain the version number files (such as AssemblyInfo.cs).
1. **File Pattern**: file pattern to search for within the `Source Path`. Defaults to "AssemblyInfo.*"
1. **Build Regex Pattern**: Regex pattern to apply to the build number in order to extract a version number. Defaults to `\d+\.\d+\.\d+\.\d+`.

## Advanced Settings
The following settings are optional and are used for advanced scenarios:

1. **Build Regex Group Index**: Use this if the Build Regex Pattern has groups to index the group that you want to use as the version number.
1. **Regex Replace Pattern**: Use this if the regex to search for in the target files is different from the Build Regex Pattern.
1. **Prefix for Replacements**: Use this if you want to prefix the replacement value with a string.
1. **Fail If No Target Match Found**: Use this to fail the task if there are no matches in the target file using the replacement regex.

## Using the Task
The task should be inserted before any build tasks.

Also, you must customize the build number format (on the General tab of the build definition) in order to specify a format in such a way that the `Build Regex Pattern` can extract a build number from it. For example, if the build number is `1.0.0$(rev:.r)`, then you can use the regex `\d+\.\d+\.\d+\.\d+` to extract the version number.

If you're just versioning assemblies, then the defaults should work just fine. However, there are some advanced scenarios.

### Android Versioning Example
If you want to version an Android app, then you need to change the version code in the AndroidManifest.xml file. The file looks something like
this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="myHealth.Client.Droid" android:versionCode="1" android:versionName="1.0" android:installLocation="auto">
	<uses-sdk android:minSdkVersion="15" />
	<application android:label="Patients" android:icon="@drawable/ic_launcher" android:theme="@style/AppTheme" android:hardwareAccelerated="true"></application>
	<uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

In order to replace the version code correctly, you should use the following settings:

1. **Build Regex Pattern**: `(?:\d+\.\d+\.\d+\.)(\d+)` - this extracts the last digit from the build number.
1. **Source Group Index**: `1` - selects the correct matching group (the last digit) instead of the entire match
1. **Regex Replace Pattern**: `versionCode="\d+` - searches for the `versionCode` setting in the file
1. **Prefix for Replacements**: `versionCode="` reinserts the correct prefix during the replacement

### iOS Versioning Example
To version an iOS app, you need to change the version numbers in the info.plist file. This file contains two relevant entries. One is `CFBundleShortVersionString`, which is also called "bundle version string, short" and is the "Version Number". It is a public facing version identifier. The other is `CFBundleVersion`, also called "Bundle version" or "Build Number". It is the full internal identifier for a particular version.

You must have a new unique Build Number for your particular app to upload iOS apps to the iTunes portal.

See further details in Apple's documentation in [Technical Note TN2420](https://developer.apple.com/library/content/technotes/tn2420/_index.html)

Note that these values do not have to be exactly three or four part version numbers, but in our example we will be using a short version with three parts, and full version with four parts. We are also assuming a four part build number as a source. You may adjust the approach as needed to accomodate different version structures, but these have been tested with app store delivery.

The beginning of the `info.plist` file might look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>YourAppName</string>
	<key>CFBundleIdentifier</key>
	<string>com.example.yourappname</string>
	<key>CFBundleShortVersionString</key>
	<string>2.16.2</string>
	<key>CFBundleVersion</key>
	<string>2.16.2.0</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>MinimumOSVersion</key>
	<string>9.0</string>
	<key>UIDeviceFamily</key>
	<array>
		<integer>2</integer>
	</array>
	
	<!-- ... further contents omitted ... -->
```

To replace the version values, use two sepparate instances of the versioning step.

The first step will replace the short version, with a three part version value using the following settings:

1. **File Pattern**: `**\info.plist` - Example file pattern to match all info.plist files
1. **Version Extract Pattern**: `1.0.0` - this extracts only the first three parts of the four part build number.
1. **Replace Pattern**: `Custom Regex`
1. **Custom Regex Replace Pattern**: `<key>CFBundleShortVersionString</key>\s*<string>.*</string>` - searches for the **short** version key and value in the file.
1. **Build Regex Group Index**: `0` - selects the entire match
1. **Prefix for Replacements**: `<key>CFBundleShortVersionString</key><string>` - reinserts the correct prefix during the replacement
1. **Postfix for Replacements** `</string>` - reinserts the postfix durring the replacement

(Note: For version 1.x of this script, the build regex pattern is: `(\d+\.\d+\.\d+)(?:\.\d+)` with group index: `1`)

The second step will replace the full version, with a four part version value using the following settings:

1. **File Pattern**: `**\info.plist` - Example file pattern to match all info.plist files
1. **Version Extract Pattern**: `1.0.0.0` - This extracts a full four part version number.
1. **Replace Pattern**: `Custom Regex`
1. **Custom Regex Replace Pattern**: `<key>CFBundleVersion</key>\s*<string>.*</string>` - searches for the **full** version key and value in the file.
1. **Build Regex Group Index**: `0` - selects the entire match
1. **Prefix for Replacements**: `<key>CFBundleVersion</key><string>` - reinserts the correct prefix during the replacement
1. **Postfix for Replacements** `</string>` - reinserts the postfix durring the replacement

(Note: For version 1.x of this script, the build regex pattern is: `\d+\.\d+\.\d+\.\d+` with group index: `0`)

### Windows Package.appxmanifest Versioning Example
Previous windows store apps, and UWP apps use a Package.appxmanifest file to version the store packages. They can generally be versioned similarly.

The beginning of the `Package.appxmanifest` file might look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>

<Package
  xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
  xmlns:mp="http://schemas.microsoft.com/appx/2014/phone/manifest"
  xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
  IgnorableNamespaces="uap mp">

  <Identity
    Name="1c842489-54f8-400b-8278-6414f7735883"
    Publisher="CN=Some.Identity"
    Version="1.2.5.5" />

  <mp:PhoneIdentity PhoneProductId="1c842489-54f8-400b-8278-6414f7735883" PhonePublisherId="00000000-0000-0000-0000-000000000000"/>

  <Properties>
    <DisplayName>App1</DisplayName>
    <PublisherDisplayName>Some.Identity</PublisherDisplayName>
    <Logo>Assets\StoreLogo.png</Logo>
  </Properties>
	
	<!-- ... further contents omitted ... -->
```

UWP Requires that the final version part to be ".0", because it is reserved for store use, as explained in the [Package Version Numbering|https://docs.microsoft.com/en-us/windows/uwp/publish/package-version-numbering] article.

In order to replace the version value for UWP, you should use the following settings:

1. **File Pattern**: `**\Package.appxmanifest` - Example file pattern to match all Package.appxmanifest files
1. **Version Extract Pattern**: `1.0.0` - This extracts the first three parts of the version number, ignoring any fourth part.
1. **Replace Pattern**: `Custom Regex`
1. **Custom Regex Replace Pattern** = `(\s)Version="\d+\.\d+\.\d+\.\d+"` - Matches the version property. **Note** that the matching leading whitespace and captial V are required to avoid matching other cases, such as the xml declaration tag version property (lowercase) or the MinVersion property present in some delcarations!
1. **Build Regex Group Index**: `0` - selects the entire match
1. **Prefix for Replacements**: `$1Version="` - reinserts the correct prefix during the replacement, including leading whitespace match.
1. **Postfix for Replacements** `.0"` - reinserts a final ".0" for store requirements, and closing quote postfix durring the replacement

In order to replace the version value correctly, you should use the following settings:

1. **File Pattern**: `**\Package.appxmanifest` - Example file pattern to match all Package.appxmanifest files
1. **Version Extract Pattern**: `1.0.0.0` - This extracts a full four part version number.
1. **Replace Pattern**: `Custom Regex`
1. **Custom Regex Replace Pattern** = `(\s)Version="\d+\.\d+\.\d+\.\d+"` - Matches the version property. **Note** that the matching leading whitespace and captial V are required to avoid matching other cases, such as the xml declaration tag version property (lowercase) or the MinVersion property present in some delcarations!
1. **Build Regex Group Index**: `0` - selects the entire match
1. **Prefix for Replacements**: `$1Version="` - reinserts the correct prefix during the replacement, including leading whitespace match.
1. **Postfix for Replacements** `"` - reinserts the closing quote postfix durring the replacement

(Note that in the 1.x version of this step, the buld regex pattern is: `\d+\.\d+\.\d+\.\d+` with regex group: `0`)
