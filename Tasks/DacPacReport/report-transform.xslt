<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dr="http://schemas.microsoft.com/sqlserver/dac/DeployReport/2012/02">
  <xsl:template match="/">
    <html>
      <head>
        <style>
          body {
            font-family: sans-serif;
          }
          h2 {
            text-decoration: underline;
            font-weight: bold;
          }
          div .errors > h2 {
            color: red;
          }
          div .warnings > h2 {
            color: #ff9900;
          }
          div .alerts > h2 {
            color: #3399ff;
          }
          div .op-warning {
            display: inline;
            border: solid 1px black;
            border-radius: 3px;
            background-color: #ffad33;
            padding: 2px 5px;
          }
          div .op-warning-container {
            margin: 10px 5px 12px 12px;
          }
          .op-type {
            display: inline;
            border: solid 1px black;
            border-radius: 5px;
            background-color: #0047b3;
            color: white;
            font-style: italic;
            padding: 2px 5px;
            margin-left: 10px;
          }
          li {
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <xsl:if test="count(dr:DeploymentReport/dr:Errors/dr:Error)!=0">
          <div class="errors">
            <h2>Errors</h2>
            <ul>
              <xsl:for-each select="dr:DeploymentReport/dr:Errors/dr:Error">
                <li>
                  <xsl:value-of select="."/>
                </li>
              </xsl:for-each>
            </ul>
          </div>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Warnings/dr:Warning)!=0">
          <div class="warnings">
            <h2>Warnings</h2>
            <ul>
              <xsl:for-each select="dr:DeploymentReport/dr:Warnings/dr:Warning">
                <li>
                  <xsl:value-of select="."/>
                </li>
              </xsl:for-each>
            </ul>
          </div>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Alerts/dr:Alert[dr:Issue[not(@Id)]])!=0">
          <div class="alerts">
            <h2>Alerts</h2>
            <xsl:for-each select="dr:DeploymentReport/dr:Alerts/dr:Alert[dr:Issue[not(@Id)]]">
              <h3>
                <xsl:value-of select="@Name"/>
              </h3>
              <ul>
                <xsl:for-each select="dr:Issue">
                  <li>
                    <xsl:value-of select="@Value"/>
                  </li>
                </xsl:for-each>
              </ul>
            </xsl:for-each>
          </div>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Operations/dr:Operation)!=0">
          <div class="operations">
            <h2>Operations</h2>
            <xsl:for-each select="dr:DeploymentReport/dr:Operations/dr:Operation">
              <h3>
                <xsl:value-of select="@Name"/>
              </h3>
              <ul>
                <xsl:for-each select="dr:Item">
                  <li>
                    <xsl:value-of select="@Value"/>
                    <span class="op-type">
                      <xsl:value-of select="@Type"/>
                    </span>
                    <xsl:apply-templates/>
                  </li>
                </xsl:for-each>
              </ul>
            </xsl:for-each>
          </div>
        </xsl:if>

        <xsl:if test="count(dr:DeploymentReport/dr:Operations)=0">
          <p>No changes - models are identical.</p>
        </xsl:if>

      </body>
    </html>
  </xsl:template>

  <xsl:template match="dr:DeploymentReport/dr:Operations/dr:Operation/dr:Item/dr:Issue">
    <div class="op-warning-container">
      <div class="op-warning">
        <i><xsl:value-of select="/dr:DeploymentReport/dr:Alerts/dr:Alert/dr:Issue[@Id=current()/@Id]/../@Name"/></i>: <xsl:value-of select="/dr:DeploymentReport/dr:Alerts/dr:Alert/dr:Issue[@Id=current()/@Id]/@Value"/>
      </div>
    </div>
  </xsl:template>

</xsl:stylesheet>