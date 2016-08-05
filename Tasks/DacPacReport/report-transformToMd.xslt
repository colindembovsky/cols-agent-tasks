<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dr="http://schemas.microsoft.com/sqlserver/dac/DeployReport/2012/02">
  <xsl:output method="text" />
  <xsl:template match="/">
        <xsl:if test="count(dr:DeploymentReport/dr:Errors/dr:Error)!=0">
## Errors
            <xsl:for-each select="dr:DeploymentReport/dr:Errors/dr:Error">
  - <xsl:value-of select="."/>
            </xsl:for-each>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Warnings/dr:Warning)!=0">
## Warnings
            <xsl:for-each select="dr:DeploymentReport/dr:Warnings/dr:Warning">
  - <xsl:value-of select="."/>
            </xsl:for-each>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Alerts/dr:Alert[dr:Issue[not(@Id)]])!=0">
## Alerts
          <xsl:for-each select="dr:DeploymentReport/dr:Alerts/dr:Alert[dr:Issue[not(@Id)]]">
  ### <xsl:value-of select="@Name"/>
              <xsl:for-each select="dr:Issue">
    - <xsl:value-of select="@Value"/>
              </xsl:for-each>
          </xsl:for-each>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Operations/dr:Operation)!=0">
## Operations
          <xsl:for-each select="dr:DeploymentReport/dr:Operations/dr:Operation">
###  <xsl:value-of select="@Name"/>
              <xsl:for-each select="dr:Item">
  - <xsl:value-of select="@Value"/> `<xsl:value-of select="@Type"/>`
    <xsl:apply-templates/>
              </xsl:for-each>
          </xsl:for-each>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Operations)=0">
No changes - models are identical.
        </xsl:if>

  </xsl:template>

  <xsl:template match="dr:DeploymentReport/dr:Operations/dr:Operation/dr:Item/dr:Issue">
    <xsl:text disable-output-escaping="yes"><![CDATA[>]]></xsl:text> **<xsl:value-of select="/dr:DeploymentReport/dr:Alerts/dr:Alert/dr:Issue[@Id=current()/@Id]/../@Name"/>**: _<xsl:value-of select="/dr:DeploymentReport/dr:Alerts/dr:Alert/dr:Issue[@Id=current()/@Id]/@Value"/>_
  </xsl:template>

</xsl:stylesheet>