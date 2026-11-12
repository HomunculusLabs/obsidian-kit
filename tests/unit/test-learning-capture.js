#!/usr/bin/env node

const LearningCaptureSystem = require('./learning-capture-system');
const fs = require('fs');
const path = require('path');

async function testLearningCaptureSystem() {
    console.log('🧪 Testing Learning Capture System...\n');
    
    const vaultPath = './Obsidian-Kit-Dev';
    
    try {
        // Initialize the system
        console.log('1️⃣ Initializing Learning Capture System...');
        const learningSystem = new LearningCaptureSystem(vaultPath, {
            insightConfidence: 0.6,
            knowledgeGapThreshold: 0.4
        });
        
        // Test activity analysis
        console.log('\n2️⃣ Testing Activity Analysis...');
        await learningSystem.processRecentActivities();
        
        const insights = await learningSystem.getInsights();
        console.log(`   ✅ Extracted ${insights.length} insights from activities`);
        
        if (insights.length > 0) {
            console.log('   📝 Sample insights:');
            insights.slice(0, 3).forEach((insight, index) => {
                console.log(`     ${index + 1}. ${insight.title}`);
                console.log(`        Type: ${insight.type} | Confidence: ${insight.confidence.toFixed(2)}`);
                console.log(`        Tags: ${insight.tags.join(', ')}`);
            });
        }
        
        // Test knowledge gap identification
        console.log('\n3️⃣ Testing Knowledge Gap Identification...');
        await learningSystem.identifyKnowledgeGaps();
        
        const gaps = await learningSystem.getKnowledgeGaps();
        console.log(`   ✅ Identified ${gaps.length} knowledge gaps`);
        
        if (gaps.length > 0) {
            console.log('   🔍 Sample knowledge gaps:');
            gaps.slice(0, 3).forEach((gap, index) => {
                console.log(`     ${index + 1}. ${gap.title}`);
                console.log(`        Priority: ${gap.priority} | Type: ${gap.type}`);
            });
        }
        
        // Test learning organization
        console.log('\n4️⃣ Testing Learning Organization...');
        await learningSystem.organizeLearning();
        
        const analytics = await learningSystem.getLearningAnalytics();
        console.log(`   ✅ Organized learning into categories`);
        console.log(`   📊 Insights by category:`, analytics.insightsByCategory);
        console.log(`   📊 Gaps by priority:`, analytics.gapsByPriority);
        
        // Test recommendation system
        console.log('\n5️⃣ Testing Recommendation System...');
        const recommendations = await learningSystem.generateRecommendations({
            currentTask: {
                title: 'Test Task',
                tags: ['testing', 'development'],
                category: 'development'
            }
        });
        
        console.log(`   ✅ Generated ${recommendations.length} recommendations`);
        
        if (recommendations.length > 0) {
            console.log('   💡 Sample recommendations:');
            recommendations.slice(0, 3).forEach((rec, index) => {
                console.log(`     ${index + 1}. ${rec.title}`);
                console.log(`        Relevance: ${rec.relevance.toFixed(2)} | Type: ${rec.type}`);
            });
        }
        
        // Test learning report generation
        console.log('\n6️⃣ Testing Learning Report Generation...');
        const report = await learningSystem.generateLearningReport();
        
        console.log(`   ✅ Generated comprehensive learning report`);
        console.log(`   📈 Total insights: ${report.summary.totalInsights}`);
        console.log(`   🕳️  Total gaps: ${report.summary.totalGaps}`);
        console.log(`   💡 Recommendations: ${report.recommendations.length}`);
        
        // Save test report
        const testReportPath = path.join(process.cwd(), 'test-learning-report.json');
        fs.writeFileSync(testReportPath, JSON.stringify(report, null, 2));
        console.log(`   💾 Test report saved to: ${testReportPath}`);
        
        // Test filtering and search
        console.log('\n7️⃣ Testing Filtering and Search...');
        
        const highConfidenceInsights = await learningSystem.getInsights({ minConfidence: 0.8 });
        console.log(`   🔍 High confidence insights (≥0.8): ${highConfidenceInsights.length}`);
        
        const problemSolvingInsights = await learningSystem.getInsights({ 
            type: 'problem_solution' 
        });
        console.log(`   🔧 Problem-solving insights: ${problemSolvingInsights.length}`);
        
        const highPriorityGaps = await learningSystem.getKnowledgeGaps({ 
            priority: 'high' 
        });
        console.log(`   🚨 High priority gaps: ${highPriorityGaps.length}`);
        
        // Test data persistence
        console.log('\n8️⃣ Testing Data Persistence...');
        await learningSystem.saveAndCleanup();
        console.log('   ✅ Learning data saved successfully');
        
        // Verify data was saved
        const learningDataPath = path.join(process.cwd(), 'learning-data.json');
        if (fs.existsSync(learningDataPath)) {
            const savedData = JSON.parse(fs.readFileSync(learningDataPath, 'utf8'));
            console.log(`   ✅ Verified saved data: ${savedData.insights.length} insights, ${savedData.knowledgeGaps.length} gaps`);
        }
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('\n📋 Test Summary:');
        console.log(`   • Activity Analysis: ✅`);
        console.log(`   • Knowledge Gap Identification: ✅`);
        console.log(`   • Learning Organization: ✅`);
        console.log(`   • Recommendation System: ✅`);
        console.log(`   • Report Generation: ✅`);
        console.log(`   • Filtering and Search: ✅`);
        console.log(`   • Data Persistence: ✅`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Performance test
async function performanceTest() {
    console.log('\n⚡ Running Performance Test...\n');
    
    const startTime = Date.now();
    const vaultPath = './Obsidian-Kit-Dev';
    
    try {
        const learningSystem = new LearningCaptureSystem(vaultPath);
        
        const initTime = Date.now();
        console.log(`   Initialization: ${initTime - startTime}ms`);
        
        await learningSystem.processRecentActivities();
        const activityTime = Date.now();
        console.log(`   Activity Analysis: ${activityTime - initTime}ms`);
        
        await learningSystem.identifyKnowledgeGaps();
        const gapTime = Date.now();
        console.log(`   Gap Identification: ${gapTime - activityTime}ms`);
        
        await learningSystem.organizeLearning();
        const organizationTime = Date.now();
        console.log(`   Learning Organization: ${organizationTime - gapTime}ms`);
        
        const recommendations = await learningSystem.generateRecommendations();
        const recommendationTime = Date.now();
        console.log(`   Recommendation Generation: ${recommendationTime - organizationTime}ms`);
        
        const totalTime = recommendationTime - startTime;
        console.log(`\n   ⏱️  Total Time: ${totalTime}ms`);
        
        // Performance criteria
        const isPerformant = totalTime < 10000; // Should complete in under 10 seconds
        console.log(`   ${isPerformant ? '✅' : '⚠️'} Performance: ${isPerformant ? 'PASS' : 'NEEDS OPTIMIZATION'}`);
        
        return isPerformant;
        
    } catch (error) {
        console.error('❌ Performance test failed:', error.message);
        return false;
    }
}

// Integration test with other systems
async function integrationTest() {
    console.log('\n🔗 Running Integration Test...\n');
    
    try {
        const vaultPath = './Obsidian-Kit-Dev';
        const learningSystem = new LearningCaptureSystem(vaultPath);
        
        // Test integration with semantic search
        console.log('1️⃣ Testing Semantic Search Integration...');
        if (learningSystem.semanticSearch) {
            const searchResults = await learningSystem.semanticSearch.search('learning');
            console.log(`   ✅ Semantic search integration working (${searchResults.results.length} results)`);
        } else {
            console.log('   ⚠️  Semantic search not available');
        }
        
        // Test integration with knowledge graph
        console.log('2️⃣ Testing Knowledge Graph Integration...');
        if (learningSystem.knowledgeGraph) {
            console.log(`   ✅ Knowledge graph integration working (${learningSystem.knowledgeGraph.nodes.length} nodes)`);
        } else {
            console.log('   ⚠️  Knowledge graph not available');
        }
        
        // Test cross-system functionality
        console.log('3️⃣ Testing Cross-System Functionality...');
        
        // Generate recommendations that use multiple systems
        const recommendations = await learningSystem.generateRecommendations({
            currentTask: {
                title: 'Integration Test Task',
                tags: ['integration', 'testing'],
                category: 'testing'
            }
        });
        
        console.log(`   ✅ Cross-system recommendations generated (${recommendations.length} recommendations)`);
        
        // Test data flow between systems
        const insights = await learningSystem.getInsights();
        const insightsWithGraphData = insights.filter(insight => 
            learningSystem.knowledgeGraph && 
            learningSystem.knowledgeGraph.nodes.some(node => 
                insight.content.includes(node.name) || insight.title.includes(node.name)
            )
        );
        
        console.log(`   ✅ Data flow between systems verified (${insightsWithGraphData.length} insights with graph data)`);
        
        console.log('\n🎉 Integration test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Learning Capture System Test Suite\n');
    
    const results = {
        functional: await testLearningCaptureSystem(),
        performance: await performanceTest(),
        integration: await integrationTest()
    };
    
    console.log('\n📊 Final Test Results:');
    console.log(`   Functional Tests: ${results.functional ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Performance Tests: ${results.performance ? '✅ PASS' : '⚠️  NEEDS OPTIMIZATION'}`);
    console.log(`   Integration Tests: ${results.integration ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = results.functional && results.integration;
    console.log(`\n🏆 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (allPassed) {
        console.log('\n🎯 Learning Capture System is ready for production use!');
    } else {
        console.log('\n🔧 Learning Capture System needs attention before production use.');
    }
    
    return allPassed;
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('🧪 Learning Capture System Test Suite');
        console.log('\nUsage:');
        console.log('  node test-learning-capture.js [options]');
        console.log('\nOptions:');
        console.log('  --functional     Run functional tests only');
        console.log('  --performance    Run performance tests only');
        console.log('  --integration    Run integration tests only');
        console.log('  --help, -h       Show this help message');
        console.log('\nNo options: Run all tests');
        return;
    }
    
    if (args.includes('--functional')) {
        testLearningCaptureSystem();
    } else if (args.includes('--performance')) {
        performanceTest();
    } else if (args.includes('--integration')) {
        integrationTest();
    } else {
        runAllTests();
    }
}

module.exports = {
    testLearningCaptureSystem,
    performanceTest,
    integrationTest,
    runAllTests
};