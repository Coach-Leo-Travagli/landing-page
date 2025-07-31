/**
 * Mercado Pago Test Component
 * 
 * Clean test component for the new preapproval plan subscription approach.
 * This follows the official Mercado Pago documentation for subscriptions.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SubscriptionCardForm from '@/components/SubscriptionCardForm';
import { validateConfiguration, createPreapprovalPlan, getPlanId, debugEnvironment } from '@/lib/mercadoPago';
import { AlertCircle, CheckCircle, AlertTriangle, TestTube } from 'lucide-react';

export default function MercadoPagoTest() {
  const [configStatus, setConfigStatus] = useState<ReturnType<typeof validateConfiguration> | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const checkConfiguration = () => {
    const config = validateConfiguration();
    setConfigStatus(config);
    
    if (config.isValid) {
      addTestResult('✅ Configuration is valid');
    } else {
      addTestResult(`❌ Configuration errors: ${config.errors.join(', ')}`);
    }
  };

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDebugEnvironment = () => {
    debugEnvironment();
    addTestResult('🔧 Debug information printed to console');
  };

  const generateCurlCommands = () => {
    try {
      addTestResult('📋 Generating CURL commands for all plans...');
      
      // This will trigger CURL command generation for each plan
      const plans = [
        { name: 'Básico', price: 129.00 },
        { name: 'Padrão', price: 199.00 },
        { name: 'VIP', price: 399.00 },
        { name: 'Test Plan', price: 99.90 },
      ];

      plans.forEach(plan => {
        try {
          createPreapprovalPlan(plan.name, plan.price, {
            frequency: 1,
            frequencyType: 'months',
            repetitions: 12,
            billingDay: 10,
          });
        } catch (error) {
          addTestResult(`📋 CURL command generated for ${plan.name} - check console`);
        }
      });

      addTestResult('✅ All CURL commands generated - check console above');
    } catch (error) {
      addTestResult(`❌ Error generating commands: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkPlanIds = () => {
    try {
      addTestResult('🔍 Checking configured plan IDs...');
      
      const planNames = ['Básico', 'Padrão', 'VIP', 'Test Plan'];
      
      planNames.forEach(planName => {
        try {
          const planId = getPlanId(planName);
          addTestResult(`✅ ${planName}: ${planId}`);
        } catch (error) {
          addTestResult(`❌ ${planName}: ${error instanceof Error ? error.message : 'Not configured'}`);
        }
      });
    } catch (error) {
      addTestResult(`💥 Error checking plan IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = () => {
    if (!configStatus) return null;
    
    if (configStatus.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6" />
            Mercado Pago Subscription Test
            <Badge variant="secondary">Preapproval Plan Approach</Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Test the new clean subscription integration using Mercado Pago's official preapproval plan approach.
          </p>
        </CardHeader>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkConfiguration} variant="outline" size="sm">
              Check Configuration
            </Button>
            <Button onClick={runDebugEnvironment} variant="outline" size="sm">
              Debug Environment
            </Button>
          </div>

          {configStatus && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <strong>Status:</strong>
                <Badge variant={configStatus.isValid ? "default" : "destructive"}>
                  {configStatus.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>
              
              {configStatus.errors.length > 0 && (
                <div>
                  <strong className="text-red-600">Errors:</strong>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {configStatus.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {configStatus.warnings.length > 0 && (
                <div>
                  <strong className="text-yellow-600">Warnings:</strong>
                  <ul className="list-disc list-inside text-sm text-yellow-600 mt-1">
                    {configStatus.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Creation Test */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Generate CURL Commands</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate CURL commands to create all plans in your terminal (avoids CORS)
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={generateCurlCommands} className="w-full">
            📋 Generate All CURL Commands
          </Button>
          <Button onClick={checkPlanIds} variant="outline" className="w-full">
            🔍 Check Configured Plan IDs
          </Button>
        </CardContent>
      </Card>

      {/* Full Subscription Test */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Complete Subscription Test</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the complete flow: plan creation + card tokenization + subscription creation
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <SubscriptionCardForm
              planName="Test Plan"
              monthlyAmount={99.90}
              onSuccess={(subscriptionId) => {
                addTestResult(`🎉 COMPLETE SUCCESS: Subscription created with ID: ${subscriptionId}`);
              }}
              onError={(error) => {
                addTestResult(`💥 COMPLETE FAILURE: ${error.message}`);
              }}
              className="w-full max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Test Results
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-sm">No test results yet...</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Reference */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Documentation Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This implementation follows the official Mercado Pago documentation:
          </p>
          <div className="bg-muted p-3 rounded">
            <strong>Subscription Associated Plan</strong><br />
            <a 
              href="https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscription-associated-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscription-associated-plan
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Setup Flow:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li><strong>Generate CURL commands</strong> (Step 1 above)</li>
              <li><strong>Run CURL commands in terminal</strong> to create plans</li>
              <li><strong>Copy plan IDs</strong> and update PLAN_IDS in mercadoPago.ts</li>
              <li><strong>Test subscriptions</strong> using existing plan IDs</li>
            </ol>
            <br />
            <strong>Subscription Flow (per customer):</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Get existing plan ID</li>
              <li>Tokenize customer's card using SDK</li>
              <li>Create subscription with plan ID and card token</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Test Cards */}
      <Card>
        <CardHeader>
          <CardTitle>💳 Test Cards for Sandbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted p-3 rounded">
              <strong>Visa</strong><br />
              4013 4013 4013 4013<br />
              CVV: 123<br />
              Expiry: 11/25
            </div>
            <div className="bg-muted p-3 rounded">
              <strong>Mastercard</strong><br />
              5031 4332 1540 6351<br />
              CVV: 123<br />
              Expiry: 11/25
            </div>
            <div className="bg-muted p-3 rounded">
              <strong>American Express</strong><br />
              3711 803032 57522<br />
              CVV: 1234<br />
              Expiry: 11/25
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}